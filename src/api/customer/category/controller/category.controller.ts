import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ApiTags } from '@nestjs/swagger';
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getAllCategories() {
    return this.categoryService.getAllCategories();
  }
}
