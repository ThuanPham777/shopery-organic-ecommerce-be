// category/category.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { CategoryController } from './controller/category.controller';
import { CategoryService } from './service/category.service';
import { CategoryAdminController } from './controller/category.admin.controller';
import { UploadService } from 'src/common/helper/upload/upload.service';
@Module({
  imports: [TypeOrmModule.forFeature([Category])],
  controllers: [CategoryController, CategoryAdminController],
  providers: [CategoryService, UploadService],
})
export class CategoryModule { }
