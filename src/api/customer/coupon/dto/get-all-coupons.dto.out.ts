import { ApiProperty } from "@nestjs/swagger";
import { CouponStatus, CouponType } from "src/database/entities/coupon/coupon.entity";
import { ApiPag } from "src/type/custom-response.type";
import { ApiPagRes } from "src/type/custom-response.type";

export class GetAllCouponsOutDto {
    @ApiProperty({ type: Number, description: 'ID của coupon' })
    id: number;

    @ApiProperty({ type: String, description: 'Mã coupon' })
    coupon_code: string;

    @ApiProperty({ type: String, description: 'Loại coupon' })
    coupon_type: CouponType;

    @ApiProperty({ type: Number, description: 'Giá trị coupon' })
    coupon_value: number;

    @ApiProperty({ type: Date, description: 'Ngày bắt đầu coupon' })
    coupon_start_date: Date;

    @ApiProperty({ type: Date, description: 'Ngày kết thúc coupon' })
    coupon_end_date: Date;

    @ApiProperty({ type: Number, description: 'Số lượng coupon đã sử dụng' })
    used_count: number;

    @ApiProperty({ type: Number, description: 'Giá trị coupon tối thiểu' })
    coupon_min_spend: number;

    @ApiProperty({ type: Number, description: 'Giá trị coupon tối đa' })
    coupon_max_spend: number;

    @ApiProperty({ type: String, description: 'Trạng thái coupon' })
    coupon_status: CouponStatus;

    @ApiProperty({ type: Number, description: 'Số lượng coupon tối đa' })
    usage_limit: number;
}


export class GetAllCouponsPagDto extends ApiPag {
    @ApiProperty({ type: GetAllCouponsOutDto, isArray: true })
    declare items: GetAllCouponsOutDto[];
}

export class GetAllCouponsOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllCouponsPagDto })
    declare data: GetAllCouponsPagDto;
}

