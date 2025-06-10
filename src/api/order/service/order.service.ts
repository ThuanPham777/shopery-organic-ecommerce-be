import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail, OrderStatus } from "src/database/entities/order/order-detail.entity";
import { OrderItem } from "src/database/entities/order/order-item.entity";
import { Repository } from "typeorm";
import { CreateOrderInDto } from "../dto/create-order.in.dto";
import { Payment, PaymentStatus } from "src/database/entities/payment/payment.entity";
import { Product } from "src/database/entities/product/product.entity";
import { GetAllOrdersInDto } from "../dto/get-all-orders.in.dto";
import { UpdateOrderInDto } from "../dto/update-order.in.dto";
import { DEFAULT_PER_PAGE } from "src/contants/common.constant";
import { GetAllOrdersOutDto } from "../dto/get-all-orders.out.dto";
import { CreateOrderOutDto } from "../dto/create-order.out.dto";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { GetOrderDetailOutDto } from "../dto/get-order-detail.out.dto";


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
        private productRepository: Repository<Product>,
        @InjectRepository(Coupon)
        private couponRepository: Repository<Coupon>
    ) { }

    async createOrder(createOrderInDto: CreateOrderInDto, userId: number): Promise<CreateOrderOutDto> {

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
            amount: totalAmout + (createOrderInDto.shippingFee || 0),
            total: totalAmout + (createOrderInDto.shippingFee || 0),
        })

        // tìm coupon

        const coupon = await this.couponRepository.findOne({ where: { id: createOrderInDto.couponId } })

        // Tạo đơn hàng
        const newOrder = this.orderRepository.create({
            user: { id: userId },
            billingAddress: createOrderInDto.billingAddress,
            shippingAddress: createOrderInDto.shippingAddress,
            total: totalAmout + (createOrderInDto.shippingFee || 0),
            status: OrderStatus.PENDING,
            payment: payment,
            items: orderItems,
            coupon: coupon || undefined
        })

        const savedOrder = await this.orderRepository.save(newOrder);

        return {
            id: savedOrder.id,
            status: savedOrder.status,
            billingAddress: savedOrder.billingAddress,
            shippingAddress: savedOrder.shippingAddress,
            paymentMethod: savedOrder.payment,
            coupon: savedOrder.coupon
        }
    }

    async getAllOrders(query: GetAllOrdersInDto): Promise<{ orders: GetAllOrdersOutDto[]; total: number }> {
        const {
            page = 1,
            perPage = DEFAULT_PER_PAGE,
            search,
            status,
            minTotal,
            maxTotal,
            startDate,
            endDate,
            sorts
        } = query
        // Tạo query builder
        const qb = this.orderRepository.createQueryBuilder('order')
            .leftJoin('order.user', 'user')
            .addSelect(['user.username', 'user.first_name', 'user.last_name', 'user.email', 'user.phone_number', 'user.avatar_url'])
            .leftJoin('order.items', 'items')
            .addSelect(['items.quantity'])
            .leftJoin('items.product', 'product')
            .addSelect(['product.name', 'product.thumbnail', 'product.price'])
            .leftJoin('order.payment', 'payment')
            .addSelect(['payment.method', 'payment.status', 'payment.amount', 'payment.total'])
            .leftJoin('order.billingAddress', 'billingAddress')
            .addSelect(['billingAddress.address', 'billingAddress.city', 'billingAddress.state', 'billingAddress.zip_code'])
            .leftJoin('order.shippingAddress', 'shippingAddress')
            .addSelect(['shippingAddress.address', 'shippingAddress.city', 'shippingAddress.state', 'shippingAddress.zip_code'])

        if (search) {
            qb.andWhere(
                '(user.username LIKE :search OR user.first_name LIKE :search OR user.last_name LIKE :search OR user.email LIKE :search OR user.phone_number LIKE :search OR CAST(order.id AS TEXT) LIKE :search OR CAST(items.product.id AS TEXT) LIKE :search)',
                { search: `%${search}%` }
            );
        }

        if (status) {
            qb.andWhere('order.status = :status', { status: status as OrderStatus });
        }

        if (minTotal !== undefined) {
            qb.andWhere('order.total >= :minTotal', { minTotal });
        }

        if (maxTotal !== undefined) {
            qb.andWhere('order.total <= :maxTotal', { maxTotal });
        }

        if (startDate) {
            qb.andWhere('order.created_at >= :startDate', {
                startDate: new Date(startDate)
            });
        }

        if (endDate) {
            const endOfDay = new Date(endDate);
            endOfDay.setHours(23, 59, 59, 999);
            qb.andWhere('order.created_at <= :endDate', {
                endDate: endOfDay
            });
        }

        // Xử lý sắp xếp
        if (sorts && sorts.length > 0) {
            const allowedFields = [
                'total', 'status', 'created_at'
            ];

            sorts.forEach(sort => {
                const [field, direction] = sort.split('|') as [string, 'asc' | 'desc'];
                if (allowedFields.includes(field)) {
                    qb.addOrderBy(`order.${field}`, direction === 'asc' ? 'ASC' : 'DESC');
                }
            });
        } else {
            // Mặc định sắp xếp theo ngày tạo mới nhất
            qb.orderBy('order.created_at', 'DESC');
        }

        // Áp dụng phân trang
        const skip = (page - 1) * perPage;
        qb.skip(skip).take(perPage);

        // Thực thi truy vấn
        const [orders, total] = await qb.getManyAndCount();

        return { orders, total };
    }

    async getOrderById(id: number): Promise<GetOrderDetailOutDto> {

        const qb = this.orderRepository.createQueryBuilder('order')
            .leftJoin('order.user', 'user')
            .addSelect(['user.username', 'user.first_name', 'user.last_name', 'user.email', 'user.phone_number', 'user.avatar_url'])
            .leftJoin('order.items', 'items')
            .addSelect(['items.quantity'])
            .leftJoin('items.product', 'product')
            .addSelect(['product.name', 'product.thumbnail', 'product.price'])
            .leftJoin('order.payment', 'payment')
            .addSelect(['payment.method', 'payment.status', 'payment.amount', 'payment.total'])
            .leftJoin('order.billingAddress', 'billingAddress')
            .addSelect(['billingAddress.address', 'billingAddress.city', 'billingAddress.state', 'billingAddress.zip_code'])
            .leftJoin('order.shippingAddress', 'shippingAddress')
            .addSelect(['shippingAddress.address', 'shippingAddress.city', 'shippingAddress.state', 'shippingAddress.zip_code'])

        const order = await qb.where('order.id = :id', { id }).getOne();

        if (!order) {
            throw new NotFoundException('Order not found')
        }
        return order
    }

    async updateOrder(id: number, updateOrderInDto: UpdateOrderInDto) {
        const order = await this.orderRepository.findOne({ where: { id } })
        if (!order) {
            throw new NotFoundException('Order not found')
        }
        order.status = updateOrderInDto.status;
        await this.orderRepository.save(order)
        return order;
    }
}