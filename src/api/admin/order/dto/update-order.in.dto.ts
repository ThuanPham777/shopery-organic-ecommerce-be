import { ApiProperty } from "@nestjs/swagger";
import { OrderStatus } from "src/database/entities/order/order-detail.entity";
export class UpdateOrderInDto {
    @ApiProperty({
        enum: OrderStatus,
        example: OrderStatus.PENDING,
        description: 'The status of the order'
    })
    status: OrderStatus;
}


