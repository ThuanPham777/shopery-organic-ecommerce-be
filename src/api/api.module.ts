import { Module } from '@nestjs/common';
import { ProductModule } from './product/product.module';
import { CategoryModule } from './category/category.module';
import { ManufacturerModule } from './manufacturer/manufacturer.module';
import { BrandModule } from './brand/brand.module';

@Module({
  imports: [ProductModule, CategoryModule, ManufacturerModule, BrandModule],
})
export class ApiModule {}
