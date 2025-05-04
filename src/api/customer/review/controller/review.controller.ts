import { ReviewService } from '../service/review.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { GetAllReviews } from '../dto/get-all-reviews.dto';
import { ApiPagRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { CreateReview } from '../dto/create-review.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { UpdateReview } from '../dto/update-review.dto';

@ApiTags('review')
@Controller('review')
@ApiBearerAuth('bearerAuth')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.USER)
  @Post('create/:productId')
  async createReviewForProduct(
    @Body() data: CreateReview,
    @Param('productId') productId: number,
    @Request() req, // lấy thông tin user từ token
  ) {
    return this.reviewService.createReviewForProduct(data, productId, {
      userId: req.user.userId,
    });
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.USER)
  @Patch(':reviewId/update')
  async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() data: UpdateReview,
    @Request() req, // lấy thông tin user từ token
  ) {
    return this.reviewService.updateReview(data, reviewId, {
      userId: req.user.userId,
    });
  }
}
