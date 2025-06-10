import { InjectRepository } from "@nestjs/typeorm";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { Repository } from "typeorm";
import { GetAllCouponsInDto } from "../dto/get-all-coupons.in.dto";
import { DEFAULT_PER_PAGE } from "src/contants/common.constant";
import { CreateCouponInDto } from "../dto/create-coupon.int.dto";
import { CreateCouponOutDto } from "../dto/create-coupon.out.dto";
import { UpdateCouponInDto } from "../dto/update-coupon.in.dto";
import { UpdateCouponOutDto } from "../dto/update-coupon.out.dto";

export class CouponService {
    constructor(
        @InjectRepository(Coupon)
        private readonly couponRepository: Repository<Coupon>,
    ) { }

    async getAllCoupons(query: GetAllCouponsInDto): Promise<{ coupons: Coupon[]; total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
        const [coupons, total] = await this.couponRepository.findAndCount({
            skip: (page - 1) * perPage,
            take: perPage,
        });

        return { coupons, total }
    }

    async createCoupon(coupon: CreateCouponInDto): Promise<CreateCouponOutDto> {
        const newCoupon = this.couponRepository.create(coupon);
        return this.couponRepository.save(newCoupon);
    }

    async updateCoupon(couponId: number, coupon: UpdateCouponInDto): Promise<UpdateCouponOutDto> {
        const updatedCoupon = await this.couponRepository.update(couponId, coupon);
        return updatedCoupon.raw;
    }

    async deleteCoupon(couponId: number): Promise<void> {
        await this.couponRepository.delete(couponId);
    }
}