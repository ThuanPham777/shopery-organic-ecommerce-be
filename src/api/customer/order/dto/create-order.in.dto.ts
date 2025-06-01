import { ApiProperty } from "@nestjs/swagger";
import { CreateAddressInDto } from "src/api/customer/address/dto/create-address.dto.in";
import { CreatePaymentInDto } from "../../payment/dto/create-payment.dto.in";
import { OrderStatus } from "src/database/entities/order/order-detail.entity";
import { createOrderItemInDto } from "./create-order-item.in.dto";

export class CreateOrderInDto {
    @ApiProperty({ type: Number, description: 'Tổng số tiền' })
    total: number;

    @ApiProperty({ type: String, description: 'Trạng thái đơn hàng' })
    status: OrderStatus;

    @ApiProperty({ type: Number, description: 'Phí vận chuyển' })
    shippingFee: number;

    @ApiProperty({ type: CreateAddressInDto, description: 'Địa chỉ thanh toán' })
    billingAddress: CreateAddressInDto;

    @ApiProperty({ type: CreateAddressInDto, description: 'Địa chỉ giao hàng' })
    shippingAddress: CreateAddressInDto;

    @ApiProperty({ type: CreatePaymentInDto, description: 'Phương thức thanh toán' })
    paymentMethod: CreatePaymentInDto;

    @ApiProperty({ type: Number, description: 'ID của mã giảm giá' })
    couponId: number;

    @ApiProperty({ type: [createOrderItemInDto], description: 'Danh sách sản phẩm' })
    orderItems: createOrderItemInDto[];

}