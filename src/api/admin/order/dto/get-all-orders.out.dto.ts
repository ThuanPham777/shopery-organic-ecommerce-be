
import { ApiProperty } from '@nestjs/swagger';
import { GetAllProductsOutDto } from 'src/api/admin/product/dto/get-all-products.out.dto';
import { Address } from 'src/database/entities/address/address.entity';
import { Coupon } from 'src/database/entities/coupon/coupon.entity';
import { OrderStatus } from 'src/database/entities/order/order-detail.entity';
import { OrderItem } from 'src/database/entities/order/order-item.entity';
import { Payment } from 'src/database/entities/payment/payment.entity';
import { User } from 'src/database/entities/user/user.entity';
import { ApiPag } from 'src/type/custom-response.type';
import { ApiPagRes } from 'src/type/custom-response.type';


export class GetAllOrdersDtoOut {
    @ApiProperty({ description: 'ID của đơn hàng' })
    id: string;

    @ApiProperty({ description: 'Tổng tiền của đơn hàng', example: 150000 })
    total: number;

    @ApiProperty({ enum: OrderStatus, description: 'Trạng thái của đơn hàng' })
    status: OrderStatus;

    @ApiProperty({ description: 'Phí vận chuyển', example: 30000, nullable: true })
    shipping_fee: number | null;

    @ApiProperty({ description: 'Ngày tạo đơn hàng (ISO string)' })
    createdAt: Date;

    @ApiProperty({ description: 'Ngày cập nhật đơn hàng (ISO string)' })
    updatedAt: Date;

    @ApiProperty({ description: 'Thông tin người dùng' })
    user: Partial<User>;

    @ApiProperty({ description: 'Địa chỉ thanh toán' })
    billingAddress: Partial<Address>;

    @ApiProperty({ description: 'Địa chỉ giao hàng' })
    shippingAddress: Partial<Address>;

    @ApiProperty({ description: 'Thông tin thanh toán' })
    payment: Partial<Payment>;

    @ApiProperty({ description: 'Thông tin mã giảm giá nếu có', nullable: true })
    coupon: Partial<Coupon> | null;

    @ApiProperty({ description: 'Danh sách sản phẩm trong đơn hàng' })
    items: Partial<OrderItem>[];
}


export class GetAllOrdersPagDto extends ApiPag {
    @ApiProperty({ type: GetAllOrdersDtoOut, isArray: true })
    declare items: GetAllOrdersDtoOut[];
}

export class GetAllOrdersOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllOrdersPagDto })
    declare data: GetAllOrdersPagDto;
}