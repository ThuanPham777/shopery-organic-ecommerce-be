import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { createCategoryDto } from '../dto/create-category.dto';
import { updateCategoryDto } from '../dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':categoryId')
  async getCategoryById(@Param('categoryId') categoryId: number) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  async createCategory(
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    return this.categoryService.createCategory(createCategoryDto, image);
  }

  @Patch(':categoryId/update')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: updateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    return this.categoryService.updateCategory(
      categoryId,
      updateCategoryDto,
      image,
    );
  }

  @Delete(':categoryId/delete')
  async deleteCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
