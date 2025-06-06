import { Review } from 'src/database/entities/review/review.entity';
import { Repository } from 'typeorm';
import { GetAllReviewsOfSingleProductInDto } from '../dto/get-all-reviews-of-single-product.in.dto';
import { CreateReviewInDto } from '../dto/create-review.in.dto';
import { User } from 'src/database/entities/user/user.entity';
import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { Product } from 'src/database/entities/product/product.entity';
import { UpdateReviewInDto } from '../dto/update-review.in.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }

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

  async createReviewForProduct(
    data: CreateReviewInDto,
    productId: number,
    jwtPayload: { userId: number },
  ): Promise<Review> {
    const product = await this.productRepository.findOne({
      where: { id: productId },
    });
    if (!product) {
      throw new NotFoundException(`Product #${productId} not found`);
    }

    const user = await this.userRepository.findOneBy({
      id: jwtPayload.userId,
    });
    if (!user)
      throw new NotFoundException(`User #${jwtPayload.userId} not found`);

    const review = this.reviewRepository.create({
      rating: data.rating,
      comment: data.comment,
      product,
      user,
    });

    const newReview = await this.reviewRepository.save(review);

    return newReview;
  }

  async updateReview(
    data: UpdateReviewInDto,
    reviewId: number,
    jwtPayload: { userId: number },
  ): Promise<Review> {
    const review = await this.reviewRepository.findOne({
      where: { id: reviewId },
      relations: ['user'],
    });
    if (!review) {
      throw new NotFoundException(`Review #${reviewId} not found`);
    }

    // 2. Kiểm tra quyền (chỉ owner mới được sửa)
    if (review.user.id !== jwtPayload.userId) {
      throw new ForbiddenException('You cannot edit this review');
    }

    if (data.rating !== undefined) {
      review.rating = data.rating;
    }
    if (data.comment !== undefined) {
      review.comment = data.comment;
    }
    review.modified_at = new Date();

    const updatedReivew = await this.reviewRepository.save(review);

    return updatedReivew;
  }
}
