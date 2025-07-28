import { Controller, Get } from '@nestjs/common';
import { CategoryService } from '../service/category.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
@ApiTags('Category')
@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  async getNameOfAllCategories() {
    const categoriesName = await this.categoryService.getNameOfAllCategories();

    return new ApiRes(categoriesName, SUCCESS);
  }
}
