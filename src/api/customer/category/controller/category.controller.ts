import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
@ApiTags('category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

  @Get()
  async getAllCategories() {
    const categories = await this.categoryService.getAllCategories();

    return new ApiRes(categories, 'Get all categories successfully');
  }
}
