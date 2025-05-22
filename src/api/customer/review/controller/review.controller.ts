import { ReviewService } from '../service/review.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
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
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiPagRes, ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { CreateReviewInDto } from '../dto/create-review.in.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { UpdateReviewInDto } from '../dto/update-review.in.dto';
import { GetAllReviewsOfSingleProductInDto } from '../dto/get-all-reviews-of-single-product.in.dto';
import { GetAllReviewsOfSingleProductOutRes } from '../dto/get-all-reviews-of-single-product.out.dto';
import { CreateReviewOutRes } from '../dto/create-review.out.dto';
import { UpdateReviewOutRes } from '../dto/update-review.out.dto';

@ApiTags('review')
@Controller('review')
@ApiBearerAuth('bearerAuth')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) { }

  @Get(':productId')
  @UsePipes(new ValidationPipe({ transform: true }))
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

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.USER)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: CreateReviewOutRes })
  @Post('create/:productId')
  async createReviewForProduct(
    @Body() data: CreateReviewInDto,
    @Param('productId') productId: number,
    @Request() req, // lấy thông tin user từ token
  ) {
    const newReview = await this.reviewService.createReviewForProduct(
      data,
      productId,
      {
        userId: req.user.userId,
      },
    );

    return new ApiRes(newReview, SUCCESS);
  }

  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(EUserRole.USER)
  @Patch(':reviewId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: UpdateReviewOutRes })
  async updateReview(
    @Param('reviewId', ParseIntPipe) reviewId: number,
    @Body() data: UpdateReviewInDto,
    @Request() req, // lấy thông tin user từ token
  ) {
    const updatedReview = await this.reviewService.updateReview(
      data,
      reviewId,
      {
        userId: req.user.userId,
      },
    );

    return new ApiRes(updatedReview, SUCCESS);
  }
}
