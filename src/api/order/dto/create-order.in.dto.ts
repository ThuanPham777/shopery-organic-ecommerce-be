import { ApiProperty } from "@nestjs/swagger";
import { CreatePaymentInDto } from "../../payment/dto/create-payment.dto.in";
import { OrderStatus } from "src/database/entities/order/order-detail.entity";
import { createOrderItemInDto } from "./create-order-item.in.dto";
import { CreateAddressInDto } from "src/api/address/dto/create-address.dto.in";
import { IsOptional } from "class-validator";

export class CreateOrderInDto {
    @ApiProperty({ type: Number, description: 'Tổng số tiền' })
    total: number;

    @ApiProperty({ type: String, description: 'Trạng thái đơn hàng' })
    status: OrderStatus;

    @ApiProperty({ type: Number, description: 'Phí vận chuyển' })
    @IsOptional()
    shippingFee?: number;

    @ApiProperty({ type: CreateAddressInDto, description: 'Địa chỉ thanh toán' })
    billingAddress: CreateAddressInDto;

    @ApiProperty({ type: CreateAddressInDto, description: 'Địa chỉ giao hàng' })
    shippingAddress: CreateAddressInDto;

    @ApiProperty({ type: CreatePaymentInDto, description: 'Phương thức thanh toán' })
    paymentMethod: CreatePaymentInDto;

    @ApiProperty({ type: Number, description: 'ID của mã giảm giá', required: false })
    @IsOptional()
    couponId?: number;

    @ApiProperty({ type: [createOrderItemInDto], description: 'Danh sách sản phẩm' })
    orderItems: createOrderItemInDto[];

}