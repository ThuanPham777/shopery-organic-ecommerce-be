import { InjectRepository } from "@nestjs/typeorm";
import { Coupon } from "src/database/entities/coupon/coupon.entity";
import { Repository } from "typeorm";
import { GetAllCouponsInDto } from "../dto/get-all-coupons.dto.in";
import { DEFAULT_PER_PAGE } from "src/contants/common.constant";

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
}