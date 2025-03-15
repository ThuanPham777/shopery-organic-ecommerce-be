import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { BrandModule } from './brand/brand.module';
import { TagModule } from './tag/tag.module';

@Module({
  imports: [
    ProductModule,
    CategoryModule,
    ManufacturerModule,
    BrandModule,
    TagModule,
  ],
})
export class ApiModule {}
