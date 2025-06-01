import { ApiProperty } from "@nestjs/swagger";
import { Address } from "src/database/entities/address/address.entity";
import { OrderItem } from "src/database/entities/order/order-item.entity";
import { Payment } from "src/database/entities/payment/payment.entity";
import { User } from "src/database/entities/user/user.entity";

export class GetOrderDetailOutDto {
    @ApiProperty()
    id: number


    @ApiProperty()
    total: number


    @ApiProperty()
    status: string

    @ApiProperty()
    payment: Payment

    @ApiProperty()
    user: User

    @ApiProperty()
    billingAddress: Address

    @ApiProperty()
    shippingAddress: Address

    @ApiProperty()
    items: OrderItem[]

    @ApiProperty()
    createdAt: Date

    @ApiProperty()
    updatedAt: Date
}