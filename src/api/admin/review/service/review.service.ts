import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Review } from 'src/database/entities/review/review.entity';
import { EUserRole } from 'src/enums/user.enums';
import { Repository } from 'typeorm';
import { GetAllReviewsOfSingleProductInDto } from '../dto/get-all-reviews-of-single-product.in.dto';
@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private readonly reviewRepository: Repository<Review>,
  ) { }

  async deleteReview(
    reviewId: number,
    jwtPayload: { userId: number; role: EUserRole },
  ): Promise<boolean> {
    // 1. Lấy review (bao gồm thông tin user)
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
      withDeleted: false, // chỉ lấy những review chưa xóa
    });

    if (!review) {
      // không tìm thấy hoặc đã xóa
      return false;
    }

    // 2. Chỉ chủ sở hữu (hoặc admin) mới được xóa
    if (
      review.user.id !== jwtPayload.userId &&
      jwtPayload.role !== EUserRole.ADMIN
    ) {
      throw new ForbiddenException('You cannot delete this review');
    }

    // 3. Soft-delete (đánh dấu deleted_at)
    await this.reviewRepository.softRemove(review);
    // hoặc: await this.reviewRepo.softDelete(reviewId);

    return true;
  }

  async getAllReviewsOfSingleProduct(
    query: GetAllReviewsOfSingleProductInDto,
    productId: number,
  ): Promise<{ reviews: Review[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;
    const [reviews, total] = await this.reviewRepository.findAndCount({
      where: { product: { id: productId } },
      relations: ['user'],
      skip,
      take,
    });

    return {
      reviews,
      total,
    };
  }
}
