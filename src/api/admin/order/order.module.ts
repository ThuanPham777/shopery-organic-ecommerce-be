import { OrderDetail } from "src/database/entities/order/order-detail.entity"
import { OrderController } from "./controller/order.controller"
import { OrderService } from "./service/order.service"
import { OrderItem } from "src/database/entities/order/order-item.entity"
import { Payment } from "src/database/entities/payment/payment.entity"
import { Coupon } from "src/database/entities/coupon/coupon.entity"
import { Product } from "src/database/entities/product/product.entity"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Module } from "@nestjs/common"


@Module({
    imports: [TypeOrmModule.forFeature([OrderDetail, OrderItem, Payment, Coupon, Product])],
    controllers: [OrderController],
    providers: [OrderService]
})
export class OrderModule { }
