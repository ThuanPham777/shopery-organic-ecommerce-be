import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { createCategoryDto } from '../dto/create-category.dto';
import { updateCategoryDto } from '../dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Admin / Category')
@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }

  @Get(':categoryId')
  @UseGuards(JwtAuthGuard)
  async getCategoryById(@Param('categoryId') categoryId: number) {
    return this.categoryService.getCategoryById(categoryId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteCategory(@Param('categoryId') categoryId: number) {
    return this.categoryService.deleteCategory(categoryId);
  }
}
