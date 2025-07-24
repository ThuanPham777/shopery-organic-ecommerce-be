import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UsePipes, ValidationPipe } from "@nestjs/common";
import { BlogService } from "../service/blog.service";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { EUserRole } from "src/enums/user.enums";
import { CreateBlogOutRes } from "../dto/create-blog.out.dto";
import { CreateBlogInDto } from "../dto/create-blog.in.dto";
import { ApiNullableRes, ApiPagRes, ApiRes } from "src/type/custom-response.type";
import { SUCCESS } from "src/contants/response.constant";
import { UpdateBlogInDto } from "../dto/update-blog.in.dto";
import { UpdateBlogOutRes } from "../dto/update-blog.out.dto";
import { GetAllBlogsInDto } from "../dto/get-all-blog.in.dto";
import { GetAllBlogsOutRes } from "../dto/get-all-blog.out.dto";
import { GetBlogOutDto } from "../dto/get-blog.out.dto";

@ApiTags('Admin / Blog')
@Controller('blog/admin')
export class BlogAdminController {
    constructor(private readonly blogService: BlogService) { }

    @Post()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateBlogOutRes })
    @UsePipes(new ValidationPipe({ transform: true }))
    async createBlog(
        @Body() createBlogInDto: CreateBlogInDto
    ) {
        const newBlog = this.blogService.createBlog(createBlogInDto);
        return new ApiRes(newBlog, SUCCESS);
    }

    @Patch(':blogId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: UpdateBlogOutRes })
    @UsePipes(new ValidationPipe({ transform: true }))
    async updateBlog(
        @Param('blogId') blogId: number,
        @Body() updateBlogInDto: UpdateBlogInDto
    ) {
        const updatedBlog = this.blogService.updateBlog(blogId, updateBlogInDto);
        return new ApiRes(updatedBlog, SUCCESS);
    }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllBlogsOutRes })
    async getAllBlogs(@Query() query: GetAllBlogsInDto) {
        const { page, perPage } = query;
        const result = await this.blogService.getAllBlogs(query);

        return new ApiPagRes(result.blogs, result.total, page, perPage, SUCCESS);
    }

    @Get(':blogId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetBlogOutDto })
    async getBlogById(@Param('blogId') blogId: number) {
        const blog = await this.blogService.getBlogById(blogId);
        return new ApiRes(blog, SUCCESS);
    }

    @Delete(':blogId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteBlog(
        @Param('blogId') blogId: number
    ) {
        await this.blogService.deleteBlog(blogId);

        return new ApiNullableRes(null, SUCCESS)
    }
}