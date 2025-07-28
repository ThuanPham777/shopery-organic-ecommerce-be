// product/product.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './service/product.service';
import { Category } from 'src/database/entities/category/category.entity';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Product } from 'src/database/entities/product/product.entity';
import { ProductImages } from 'src/database/entities/product/product-image.entity';
import { ProductController } from './controller/product.controller';
import { ProductAdminController } from './controller/product.admin.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      Product,
      Category,
      Brand,
      Manufacturer,
      Tag,
      ProductImages,
    ]),
  ],
  controllers: [ProductController, ProductAdminController],
  providers: [ProductService],
})
export class ProductModule {}
