import { ApiProperty } from "@nestjs/swagger";
import { CouponStatus, CouponType } from "src/database/entities/coupon/coupon.entity";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateCouponOutDto {

    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    coupon_code: string;

    @ApiProperty({ type: String })
    coupon_type: CouponType;

    @ApiProperty({ type: Number })
    coupon_value: number;

    @ApiProperty({ type: Date })
    coupon_start_date: Date;

    @ApiProperty({ type: Date })
    coupon_end_date: Date;

    @ApiProperty({ type: Number })
    used_count: number;

    @ApiProperty({ type: Number })
    usage_limit: number;

    @ApiProperty({ type: Number })
    coupon_min_spend: number;

    @ApiProperty({ type: Number })
    coupon_max_spend: number;

    @ApiProperty({ type: String })
    coupon_status: CouponStatus;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}


export class UpdateCouponOutRes extends ApiRes {
    @ApiProperty({ type: UpdateCouponOutDto })
    declare data: UpdateCouponOutDto;
}