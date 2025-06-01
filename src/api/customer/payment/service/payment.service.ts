import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Payment, PaymentMethod, PaymentStatus } from "src/database/entities/payment/payment.entity";
import { CreatePaymentInDto } from "../dto/create-payment.dto.in";
import Stripe from 'stripe';
import axios from 'axios';

@Injectable()
export class PaymentService {
    private stripeClient: Stripe;
    private paypalAccessToken: string;
    private readonly paypalBaseUrl: string;

    constructor(
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
    ) {
        if (!process.env.STRIPE_SECRET_KEY) {
            throw new Error('STRIPE_SECRET_KEY is not defined');
        }
        if (!process.env.PAYPAL_CLIENT_ID || !process.env.PAYPAL_CLIENT_SECRET) {
            throw new Error('PayPal credentials are not defined');
        }

        // Khởi tạo stripe client
        this.stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
            apiVersion: '2025-05-28.basil',
        });

        // Khởi tạo PayPal configuration
        this.paypalBaseUrl = process.env.NODE_ENV === 'production'
            ? 'https://api-m.paypal.com'
            : 'https://api-m.sandbox.paypal.com';

        this.initializePayPal();
    }

    private async initializePayPal() {
        try {
            const auth = Buffer.from(
                `${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`
            ).toString('base64');

            const response = await axios.post(
                `${this.paypalBaseUrl}/v1/oauth2/token`,
                'grant_type=client_credentials',
                {
                    headers: {
                        'Authorization': `Basic ${auth}`,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    }
                }
            );

            this.paypalAccessToken = response.data.access_token;
        } catch (error) {
            throw new Error(`Failed to initialize PayPal: ${error.message}`);
        }
    }

    private async getPayPalHeaders() {
        if (!this.paypalAccessToken) {
            await this.initializePayPal();
        }
        return {
            'Authorization': `Bearer ${this.paypalAccessToken}`,
            'Content-Type': 'application/json'
        };
    }

    async processPayment(
        paymentId: string,
        method: PaymentMethod,
        paymentData: any,
    ) {
        const payment = await this.paymentRepository.findOne({
            where: { id: Number(paymentId) },
            relations: ['order'],
        });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        switch (method) {
            case PaymentMethod.COD:
                return this.processCod(payment);

            case PaymentMethod.STRIPE:
                return this.processStripe(payment, paymentData);

            case PaymentMethod.PAYPAL:
                return this.processPaypal(payment, paymentData);

            default:
                throw new Error('Unsupported payment method');
        }
    }

    private async processCod(payment: Payment) {
        // COD không cần xử lý thanh toán ngay
        payment.status = PaymentStatus.PENDING;
        await this.paymentRepository.save(payment);

        return {
            status: 'pending',
            message: 'Payment will be collected on delivery',
            paymentId: payment.id,
        };
    }

    private async processStripe(payment: Payment, paymentData: any) {
        try {
            const { token } = paymentData;

            const charge = await this.stripeClient.charges.create({
                amount: Math.round(payment.amount * 100), // Chuyển đổi sang cents
                currency: 'usd',
                source: token,
                description: `Payment for order ${payment.order.id}`,
            });

            payment.status = PaymentStatus.COMPLETED;
            payment.transaction_id = charge.id;
            await this.paymentRepository.save(payment);

            return {
                status: 'completed',
                chargeId: charge.id,
                paymentId: payment.id,
            };
        } catch (error) {
            payment.status = PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);

            throw new Error(`Stripe payment failed: ${error.message}`);
        }
    }

    private async processPaypal(payment: Payment, paymentData: any) {
        try {
            const { orderId } = paymentData;

            // Capture the PayPal order
            const response = await axios.post(
                `${this.paypalBaseUrl}/v2/checkout/orders/${orderId}/capture`,
                {},
                { headers: await this.getPayPalHeaders() }
            );

            if (response.data.status === 'COMPLETED') {
                payment.status = PaymentStatus.COMPLETED;
                payment.transaction_id = response.data.id;
                await this.paymentRepository.save(payment);

                return {
                    status: 'completed',
                    orderId: response.data.id,
                    paymentId: payment.id,
                };
            } else {
                throw new Error('PayPal payment not completed');
            }
        } catch (error) {
            payment.status = PaymentStatus.FAILED;
            await this.paymentRepository.save(payment);
            throw new Error(`PayPal payment failed: ${error.message}`);
        }
    }

    // Tạo payment intent cho client-side Stripe
    async createStripePaymentIntent(paymentId: string) {
        const payment = await this.paymentRepository.findOneBy({ id: Number(paymentId) });

        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        const paymentIntent = await this.stripeClient.paymentIntents.create({
            amount: Math.round(payment.amount * 100),
            currency: 'usd',
            metadata: { paymentId },
            automatic_payment_methods: {
                enabled: true,
            },
            description: `Payment for order ${payment.order?.id || 'unknown'}`,
        });

        return {
            clientSecret: paymentIntent.client_secret,
            paymentId: payment.id,
        };
    }

    async createPaypalOrder(paymentId: string) {
        const payment = await this.paymentRepository.findOneBy({ id: Number(paymentId) });
        if (!payment) {
            throw new NotFoundException('Payment not found');
        }

        try {
            const response = await axios.post(
                `${this.paypalBaseUrl}/v2/checkout/orders`,
                {
                    intent: 'CAPTURE',
                    purchase_units: [{
                        amount: {
                            currency_code: 'USD',
                            value: payment.amount.toString(),
                        },
                        reference_id: paymentId,
                    }],
                },
                { headers: await this.getPayPalHeaders() }
            );

            return {
                orderId: response.data.id,
                paymentId: payment.id,
            };
        } catch (error) {
            throw new Error(`Failed to create PayPal order: ${error.message}`);
        }
    }

    async createPayment(payment: CreatePaymentInDto): Promise<Payment> {
        const paymentEntity = this.paymentRepository.create(payment);
        return this.paymentRepository.save(paymentEntity);
    }
}