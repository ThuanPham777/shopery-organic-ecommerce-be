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
import { CreateCategoryInDto } from '../dto/create-category.in.dto';
import { UpdateCategoryInDto } from '../dto/update-category.in.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllCategoriesInDto } from '../dto/get-all-categories.in.dto';
import {
    ApiNullableRes,
    ApiPagRes,
    ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllCategoriesOutRes } from '../dto/get-all-categories.out.dto';
import { CreateCategoryOutRes } from '../dto/create-category.out.dto';
import { EUserRole } from 'src/enums/user.enums';

@ApiTags('Admin / Category')
@Controller('admin/category')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class CategoryAdminController {
    constructor(private readonly categoryService: CategoryService) { }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllCategoriesOutRes })
    async getAllCategories(@Query() query: GetAllCategoriesInDto) {
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

    @Post()
    @UsePipes(new ValidationPipe())
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateCategoryOutRes })
    async createCategory(
        @Body() createCategoryDto: CreateCategoryInDto,
    ) {
        const newCategory = await this.categoryService.createCategory(
            createCategoryDto,
        );

        return new ApiRes(newCategory, SUCCESS);
    }

    @Patch(':categoryId')
    @UsePipes(new ValidationPipe())
    @Roles(EUserRole.ADMIN)
    async updateCategory(
        @Param('categoryId') categoryId: number,
        @Body() updateCategoryDto: UpdateCategoryInDto,
    ) {
        const updatedCategory = await this.categoryService.updateCategory(
            categoryId,
            updateCategoryDto,
        );

        return new ApiRes(updatedCategory, SUCCESS);
    }

    @Delete(':categoryId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteCategory(@Param('categoryId') categoryId: number) {
        await this.categoryService.deleteCategory(categoryId);

        return new ApiNullableRes(null, SUCCESS);
    }

    @Post('upload/image')
    @Roles(EUserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @ApiOkResponse({ type: ApiRes })
    @UseInterceptors(FileInterceptor('image'))
    async uploadCategoryImage(@UploadedFile() image: Express.Multer.File) {
        const uploadedImage = await this.categoryService.uploadCategoryImage(image);
        return new ApiRes(uploadedImage, SUCCESS);
    }
}
