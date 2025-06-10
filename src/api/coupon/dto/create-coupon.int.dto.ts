import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsString } from "class-validator";
import { INVALID_ENUM, INVALID_NUMBER, INVALID_REQUIRED, INVALID_STRING } from "src/contants/invalid.constant";
import { CouponStatus, CouponType } from "src/database/entities/coupon/coupon.entity";

export class CreateCouponInDto {
    @ApiProperty({
        description: 'The coupon code',
        example: '10OFF',
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsString({ message: INVALID_STRING })
    coupon_code: string;

    @ApiProperty({
        description: 'The coupon type',
        example: 'percentage',
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsEnum(CouponType, { message: INVALID_ENUM(Object.values(CouponType)) })
    coupon_type: CouponType;

    @ApiProperty({
        description: 'The coupon value',
        example: 10,
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_value: number;

    @ApiProperty({
        description: 'The coupon start date',
        example: '2021-01-01',
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsDate()
    coupon_start_date: Date;

    @ApiProperty({
        description: 'The coupon end date',
        example: '2021-01-01',
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsDate()
    coupon_end_date: Date;

    @ApiProperty({
        description: 'The coupon used count',
        example: 10,
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    used_count: number;

    @ApiProperty({
        description: 'The coupon usage limit',
        example: 10,
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    usage_limit: number;

    @ApiProperty({
        description: 'The coupon min spend',
        example: 100,
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_min_spend: number;

    @ApiProperty({
        description: 'The coupon max spend',
        example: 100,
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsNumber({}, { message: INVALID_NUMBER })
    coupon_max_spend: number;

    @ApiProperty({
        description: 'The coupon status',
        example: 'active',
    })
    @IsNotEmpty({ message: INVALID_REQUIRED })
    @IsEnum(CouponStatus, { message: INVALID_ENUM(Object.values(CouponStatus)) })
    coupon_status: CouponStatus;
}