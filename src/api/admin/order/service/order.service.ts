import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { OrderDetail, OrderStatus } from "src/database/entities/order/order-detail.entity";
import { Repository } from "typeorm";
import { GetAllOrdersDtoIn } from "../dto/get-all-orders.in.dto";
import { DEFAULT_PER_PAGE } from "src/contants/common.constant";
import { UpdateOrderInDto } from "../dto/update-order.in.dto";

@Injectable()
export class

    OrderService {
    constructor(
        @InjectRepository(OrderDetail)
        private orderRepository: Repository<OrderDetail>,
    ) { }


    async getAllOrders(query: GetAllOrdersDtoIn): Promise<{ orders: OrderDetail[]; total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE } = query
        const [orders, total] = await this.orderRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage
        })
        return { orders, total };
    }

    async getOrderById(id: number): Promise<OrderDetail> {
        const order = await this.orderRepository.findOne({ where: { id }, relations: ['items', 'payment', 'user', 'billingAddress', 'shippingAddress'] })
        if (!order) {
            throw new NotFoundException('Order not found')
        }
        return order
    }

    async updateOrder(id: number, updateOrderInDto: UpdateOrderInDto) {
        const order = await this.getOrderById(id)
        order.status = updateOrderInDto.status;
        await this.orderRepository.save(order)
    }
}