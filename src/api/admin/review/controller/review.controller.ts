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
} from '@nestjs/common';
import { ReviewService } from '../service/review.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetAllReviews } from 'src/api/customer/review/dto/get-all-reviews.dto';
import { ApiPagRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Admin / Review')
@ApiBearerAuth('bearerAuth')
@Controller('admin/review')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.ADMIN)
  @Delete(':reviewId/delete')
  async deleteReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Request() req, // inject user từ JWT
  ) {
    const result = await this.reviewService.deleteReview(reviewId, {
      userId: req.user.userId,
      role: req.user.role,
    });
    return {
      success: result,
      message: result
        ? 'Review deleted successfully'
        : 'Review not found or not allowed',
    };
  }

  @Get(':productId')
  async getAllReviewsOfSingleProduct(
    @Query() query: GetAllReviews,
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
