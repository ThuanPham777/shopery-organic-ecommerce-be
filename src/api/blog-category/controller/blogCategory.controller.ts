import {
    Controller,
    Get,
    UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import {
    ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { BlogCategoryService } from '../service/blogCategory.service';

@ApiTags('BlogCategory')
@Controller('blogCategory')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class BlogCategoryAdminController {
    constructor(private readonly blogCategoryService: BlogCategoryService) { }

    @Get()
    async getNameOfAllBlogCategories() {
        const categoriesName = await this.blogCategoryService.getNameOfAllBlogCategories();

        return new ApiRes(categoriesName, SUCCESS);
    }
}
