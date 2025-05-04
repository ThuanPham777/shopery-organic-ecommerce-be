import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllCategories } from '../dto/get-all-categories.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Admin / Category')
@Controller('admin/category')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @Roles('admin')
  async getAllCategories(@Query() query: GetAllCategories) {
    const { page, perPage } = query;
    const result = await this.categoryService.getAllCategories(query);

    return new ApiPagRes(
      result.categories,
      result.total,
      page,
      perPage,
      SUCCESS,
    );
  }

  @Get(':categoryId')
  @Roles('admin')
  async getCategoryById(@Param('categoryId') categoryId: number) {
    const category = await this.categoryService.getCategoryById(categoryId);

    return new ApiRes(category, SUCCESS);
  }

  @Post('create')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @Roles('admin')
  async createCategory(
    @Body() createCategoryDto: createCategoryDto,
    @UploadedFile() image: Express.Multer.File,
  ) {
    const newCategory = await this.categoryService.createCategory(
      createCategoryDto,
      image,
    );

    return new ApiRes(newCategory, SUCCESS);
  }

  @Patch(':categoryId/update')
  @UsePipes(new ValidationPipe())
  @UseInterceptors(FileInterceptor('image'))
  @Roles('admin')
  async updateCategory(
    @Param('categoryId') categoryId: number,
    @Body() updateCategoryDto: updateCategoryDto,
    @UploadedFile() image?: Express.Multer.File,
  ) {
    const updatedCategory = await this.categoryService.updateCategory(
      categoryId,
      updateCategoryDto,
      image,
    );

    return new ApiRes(updatedCategory, SUCCESS);
  }

  @Delete(':categoryId/delete')
  @Roles('admin')
  async deleteCategory(@Param('categoryId') categoryId: number) {
    await this.categoryService.deleteCategory(categoryId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
