import { ApiProperty } from "@nestjs/swagger";
import { PaymentMethod, PaymentStatus } from "src/database/entities/payment/payment.entity";
import { ApiRes } from "src/type/custom-response.type";

export class CreatePaymentOutDto {
    @ApiProperty({ type: Number, description: 'ID của đơn hàng' })
    order_id: number;

    @ApiProperty({ type: Number, description: 'Tổng tiền' })
    total: number;

    @ApiProperty({ type: Number, description: 'Số tiền' })
    amount: number;

    @ApiProperty({ type: String, description: 'Phương thức thanh toán' })
    method: PaymentMethod;

    @ApiProperty({ type: String, description: 'Trạng thái thanh toán' })
    status: PaymentStatus;

    @ApiProperty({ type: Number, description: 'ID của giao dịch' })
    transaction_id: number;
}

export class CreatePaymentOutRes extends ApiRes {
    @ApiProperty({ type: CreatePaymentOutDto })
    declare data: CreatePaymentOutDto;
}
