import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail, OrderStatus } from "src/database/entities/order/order-detail.entity";
import { OrderItem } from "src/database/entities/order/order-item.entity";
import { Repository } from "typeorm";
import { CreateOrderInDto } from "../dto/create-order.in.dto";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { Address } from "src/database/entities/address/address.entity";
import { Payment, PaymentStatus } from "src/database/entities/payment/payment.entity";
import { Product } from "src/database/entities/product/product.entity";


@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(OrderDetail)
        private orderRepository: Repository<OrderDetail>,
        @InjectRepository(OrderItem)
        private orderItemRepository: Repository<OrderItem>,
        @InjectRepository(Payment)
        private paymentRepository: Repository<Payment>,
        @InjectRepository(Product)
        private productRepository: Repository<Product>

    ) { }

    async getOrderById(id: number): Promise<OrderDetail> {
        const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'payment', 'user', 'billingAddress', 'shippingAddress'] })
        if (!order) {
            throw new NotFoundException('Order not found')
        }
        return order;
    }

    async createOrder(createOrderInDto: CreateOrderInDto, userId: number): Promise<OrderDetail> {

        // Tính tổng giá sản phẩm
        let totalAmout = 0;
        const orderItems: OrderItem[] = [];
        for (const item of createOrderInDto.orderItems) {
            const product = await this.productRepository.findOne({ where: { id: item.productId } })
            if (!product) {
                throw new NotFoundException('Product not found')
            }

            const subtotal = product.price * item.quantity;
            totalAmout += subtotal;

            const orderItem = this.orderItemRepository.create({
                product: { id: item.productId },
                quantity: item.quantity,
            })

            orderItems.push(orderItem);
        }

        // Tạo thanh toán
        const payment = this.paymentRepository.create({
            method: createOrderInDto.paymentMethod.method,
            status: PaymentStatus.PENDING,
            amount: totalAmout + createOrderInDto.shippingFee,
            total: totalAmout + createOrderInDto.shippingFee,
        })

        // Tạo đơn hàng

        const newOrder = this.orderRepository.create({
            user: { id: userId },
            billingAddress: createOrderInDto.billingAddress,
            shippingAddress: createOrderInDto.shippingAddress,
            total: totalAmout + createOrderInDto.shippingFee,
            status: OrderStatus.PENDING,
            payment: payment,
            items: orderItems,
        })

        const order = await this.orderRepository.save(newOrder);

        return order;
    }

}