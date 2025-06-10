import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from 'src/database/entities/review/review.entity';
import { ReviewController } from './controller/review.controller';
import { ReviewService } from './service/review.service';
import { Product } from 'src/database/entities/product/product.entity';
import { User } from 'src/database/entities/user/user.entity';
import { ReviewAdminController } from './controller/review.admin.controller';
@Module({
  imports: [TypeOrmModule.forFeature([Review, Product, User])],
  controllers: [ReviewController, ReviewAdminController],
  providers: [ReviewService],
})
export class ReviewModule { }
