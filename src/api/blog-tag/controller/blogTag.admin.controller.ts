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
import { BlogTagService } from '../service/blogTag.service';
import { GetAllBlogTagsOutRes } from '../dto/get-all-blog-tags.out.dto';
import { GetAllBlogTagsInDto } from '../dto/get-all-blog-tags.in.dto';
import { CreateBlogTagOutRes } from '../dto/create-blog-tag.out.dto';
import { CreateBlogTagInDto } from '../dto/create-blog-tag.in.dto';
import { UpdateBlogTagOutRes } from '../dto/update-blog-tag.out.dto';
import { UpdateBlogTagInDto } from '../dto/update-blog-tag.in.dto';

@ApiTags('Admin / BlogTag')
@Controller('admin/blogTag')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class BlogTagAdminController {
    constructor(private readonly blogTagService: BlogTagService) { }
    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllBlogTagsOutRes })
    async getAllTags(@Query() query: GetAllBlogTagsInDto) {
        const { page, perPage } = query;

        const result = await this.blogTagService.getAllBlogTags(query);

        return new ApiPagRes(result.tags, result.total, page, perPage, SUCCESS);
    }

    @Post()
    @Roles(EUserRole.ADMIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({ type: CreateBlogTagOutRes })
    async createTag(@Body() createTagDto: CreateBlogTagInDto) {
        const newTag = await this.blogTagService.createBlogTag(createTagDto);
        return new ApiRes(newTag, SUCCESS);
    }

    @Patch(':tagId')
    @Roles(EUserRole.ADMIN)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({ type: UpdateBlogTagOutRes })
    async updateTag(
        @Param('tagId') tagId: number,
        @Body() updateTagDto: UpdateBlogTagInDto,
    ) {
        const updatedTag = await this.blogTagService.updateTag(tagId, updateTagDto);
        return new ApiRes(updatedTag, SUCCESS);
    }

    @Delete(':tagId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteTag(@Param('tagId') tagId: number) {
        await this.blogTagService.deleteTag(tagId);
        return new ApiNullableRes(null, SUCCESS);
    }
}
