import { TypeOrmModule } from "@nestjs/typeorm";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { CouponController } from "./controller/coupon.controller";
import { CouponService } from "./service/coupon.service";
import { Module } from "@nestjs/common";


@Module({
    imports: [TypeOrmModule.forFeature([Coupon])],
    controllers: [CouponController],
    providers: [CouponService],
    exports: [CouponService],
})
export class CouponModule { }

