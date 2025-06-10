// src/review/review.controller.ts
import {
    Controller,
    Delete,
    Param,
    UseGuards,
    ParseIntPipe,
    Request,
    Get,
    Query,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    ApiNullableRes,
    ApiPagRes,
    ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllReviewsOfSingleProductInDto } from '../dto/get-all-reviews-of-single-product.in.dto';
import { GetAllReviewsOfSingleProductOutRes } from '../dto/get-all-reviews-of-single-product.out.dto';

@ApiTags('Admin / Review')
@ApiBearerAuth()
@Controller('admin/review')
export class ReviewAdminController {
    constructor(private readonly reviewService: ReviewService) { }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(EUserRole.ADMIN)
    @Delete(':reviewId')
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteReview(
        @Param('reviewId', ParseIntPipe) reviewId: number,
        @Request() req, // inject user từ JWT
    ) {
        await this.reviewService.deleteReview(reviewId, {
            userId: req.user.userId,
            role: req.user.role,
        });

        return new ApiNullableRes(null, SUCCESS);
    }

    @Get(':productId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllReviewsOfSingleProductOutRes })
    async getAllReviewsOfSingleProduct(
        @Query() query: GetAllReviewsOfSingleProductInDto,
        @Param('productId') productId: number,
    ) {
        const { page, perPage } = query;
        const result = await this.reviewService.getAllReviewsOfSingleProduct(
            query,
            productId,
        );

        return new ApiPagRes(result.reviews, result.total, page, perPage, SUCCESS);
    }
}
