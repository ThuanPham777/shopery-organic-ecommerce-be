import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { BrandModule } from './brand/brand.module';
import { TagModule } from './tag/tag.module';
import { UserModule } from './user/user.module';
import { ReviewModule } from './review/review.module';

@Module({
  imports: [
    UserModule,
    ProductModule,
    CategoryModule,
    ManufacturerModule,
    BrandModule,
    TagModule,
    ReviewModule,
  ],
})
export class AdminApiModule {}
