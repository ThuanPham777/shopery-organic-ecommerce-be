import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsNumber, IsString, IsDate } from 'class-validator';
import { INVALID_ENUM, INVALID_NUMBER, INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';
import { CouponType, CouponStatus } from 'src/database/entities/coupon/coupon.entity';

export class UpdateCouponInDto {
    @ApiProperty({ type: String })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsString({ message: INVALID_STRING })
    coupon_code?: string;

    @ApiProperty({ type: String })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsEnum(CouponType, { message: INVALID_ENUM(Object.values(CouponType)) })
    coupon_type?: CouponType;

    @ApiProperty({ type: Number })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_value?: number;

    @ApiProperty({ type: Date })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsDate()
    coupon_start_date?: Date;

    @ApiProperty({ type: Date })
    @IsOptional()
    @IsDate()
    coupon_end_date?: Date;

    @ApiProperty({ type: Number })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    used_count?: number;

    @ApiProperty({ type: Number })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    usage_limit?: number;

    @ApiProperty({ type: Number })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_min_spend?: number;

    @ApiProperty({ type: Number })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_max_spend?: number;

    @ApiProperty({ type: String })
    @IsOptional({ message: INVALID_REQUIRED })
    @IsEnum(CouponStatus, { message: INVALID_ENUM(Object.values(CouponStatus)) })
    coupon_status?: CouponStatus;
}
