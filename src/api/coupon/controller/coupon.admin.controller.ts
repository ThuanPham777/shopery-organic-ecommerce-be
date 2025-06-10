import { Body, Controller, Delete, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { CouponService } from "../service/coupon.service";
import { ApiBearerAuth, ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "src/guards/jwt-auth.guard";
import { RoleGuard } from "src/guards/role.guard";
import { CreateCouponInDto } from "../dto/create-coupon.int.dto";
import { CreateCouponOutDto } from "../dto/create-coupon.out.dto";
import { EUserRole } from "src/enums/user.enums";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { SUCCESS } from "src/contants/response.constant";
import { ApiNullableRes, ApiRes } from "src/type/custom-response.type";
import { UpdateCouponOutDto } from "../dto/update-coupon.out.dto";
import { UpdateCouponInDto } from "../dto/update-coupon.in.dto";

@ApiTags('Admin / Coupon')
@Controller('coupon/admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CouponAdminController {
    constructor(private readonly couponService: CouponService) { }

    @Post()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateCouponOutDto })
    async createCoupon(@Body() createCouponDto: CreateCouponInDto) {
        const result = await this.couponService.createCoupon(createCouponDto);
        return new ApiRes(result, SUCCESS);
    }

    @Patch(':couponId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: UpdateCouponOutDto })
    async updateCoupon(@Param('couponId') couponId: number, @Body() updateCouponDto: UpdateCouponInDto) {
        const result = await this.couponService.updateCoupon(couponId, updateCouponDto);
        return new ApiRes(result, SUCCESS);
    }

    @Delete(':couponId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteCoupon(@Param('couponId') couponId: number) {
        await this.couponService.deleteCoupon(couponId);
        return new ApiNullableRes(null, SUCCESS);
    }
}