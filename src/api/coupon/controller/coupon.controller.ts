import { GetAllCouponsOutRes } from "../dto/get-all-coupons.out.dto";
import { GetAllCouponsInDto } from "../dto/get-all-coupons.in.dto";
import { Controller, Query, UseGuards } from "@nestjs/common";
import { Get } from "@nestjs/common";
import { CouponService } from "../service/coupon.service";
import { SUCCESS } from "src/contants/response.constant";
import { ApiPagRes } from "src/type/custom-response.type";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { RoleGuard } from "src/guards/role.guard";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { EUserRole } from "src/enums/user.enums";

@ApiTags("Coupon")
@Controller("coupon")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CouponController {
    constructor(private readonly couponService: CouponService) { }

    @Get()
    @Roles(EUserRole.USER)
    @ApiOkResponse({ type: GetAllCouponsOutRes })
    async getAllCoupons(@Query() query: GetAllCouponsInDto) {
        const { page, perPage } = query;
        const result = await this.couponService.getAllCoupons(query);
        return new ApiPagRes(result.coupons, result.total, page, perPage, SUCCESS);
    }
}
