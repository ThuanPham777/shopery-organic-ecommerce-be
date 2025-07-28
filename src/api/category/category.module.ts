// category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryAdminController } from './controller/category.admin.controller';
import { CategoryAttribute } from 'src/database/entities/category/category-attribute.entity';
import { Attribute } from 'src/database/entities/attribute/attribute.entity';
@Module({
  imports: [TypeOrmModule.forFeature([Category, CategoryAttribute, Attribute])],
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService],
})
export class CategoryModule {}
