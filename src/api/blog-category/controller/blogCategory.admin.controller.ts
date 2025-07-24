import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import {
    ApiNullableRes,
    ApiPagRes,
    ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { EUserRole } from 'src/enums/user.enums';
import { BlogCategoryService } from '../service/blogCategory.service';
import { GetAllBlogCategoriesInDto } from '../dto/get-all-blog-categories.in.dto';
import { GetAllBlogCategoriesOutRes } from '../dto/get-all-blog-categories.out.dto';
import { CreateBlogCategoryOutRes } from '../dto/create-blog-category.out.dto';
import { CreateBlogCategoryInDto } from '../dto/create-blog-category.in.dto';
import { UpdateBlogCategoryInDto } from '../dto/update-blog-category.in.dto';

@ApiTags('Admin / BlogCategory')
@Controller('admin/blogCategory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class BlogCategoryAdminController {
    constructor(private readonly blogCategoryService: BlogCategoryService) { }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllBlogCategoriesOutRes })
    async getAllCategories(@Query() query: GetAllBlogCategoriesInDto) {
        const { page, perPage } = query;
        const result = await this.blogCategoryService.getAllBlogCategories(query);

        return new ApiPagRes(
            result.blogCategories,
            result.total,
            page,
            perPage,
            SUCCESS,
        );
    }

    @Post()
    @UsePipes(new ValidationPipe())
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateBlogCategoryOutRes })
    async createCategory(
        @Body() createBlogCategoryDto: CreateBlogCategoryInDto,
    ) {
        const newCategory = await this.blogCategoryService.createBlogCategory(createBlogCategoryDto)

        return new ApiRes(newCategory, SUCCESS);
    }

    @Patch(':categoryId')
    @UsePipes(new ValidationPipe())
    @Roles(EUserRole.ADMIN)
    async updateCategory(
        @Param('categoryId') categoryId: number,
        @Body() updateBlogCategoryDto: UpdateBlogCategoryInDto,
    ) {
        const updatedCategory = await this.blogCategoryService.updateBlogCategory(
            categoryId,
            updateBlogCategoryDto,
        );

        return new ApiRes(updatedCategory, SUCCESS);
    }

    @Delete(':categoryId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteCategory(@Param('categoryId') categoryId: number) {
        await this.blogCategoryService.deleteCategory(categoryId);

        return new ApiNullableRes(null, SUCCESS);
    }

}
