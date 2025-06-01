import { ApiProperty } from "@nestjs/swagger";
import { Address } from "src/database/entities/address/address.entity";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { OrderStatus } from "src/database/entities/order/order-detail.entity";
import { Payment } from "src/database/entities/payment/payment.entity";
import { ApiRes } from "src/type/custom-response.type";

export class CreateOrderOutDto {
    @ApiProperty({ type: Number, description: 'ID của đơn hàng' })
    id: number;

    @ApiProperty({ type: String, description: 'Trạng thái đơn hàng' })
    status: OrderStatus;

    @ApiProperty({ type: Object, description: 'Địa chỉ thanh toán' })
    billingAddress: Address;

    @ApiProperty({ type: Object, description: 'Địa chỉ giao hàng' })
    shippingAddress: Address;

    @ApiProperty({ type: Object, description: 'Phương thức thanh toán' })
    paymentMethod: Payment;

    @ApiProperty({ type: Object, description: 'Mã giảm giá' })
    coupon: Coupon;
}

export class CreateOrderOutRes extends ApiRes {
    @ApiProperty({ type: CreateOrderOutDto })
    declare data: CreateOrderOutDto;
}
