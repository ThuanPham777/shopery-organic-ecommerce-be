import { Controller, Get, Param, Query } from "@nestjs/common";
import { BlogService } from "../service/blog.service";
import { Roles } from "src/api/auth/decorators/roles.decorator";
import { EUserRole } from "src/enums/user.enums";
import { ApiOkResponse, ApiTags } from "@nestjs/swagger";
import { GetAllBlogsOutRes } from "../dto/get-all-blog.out.dto";
import { GetAllBlogsInDto } from "../dto/get-all-blog.in.dto";
import { ApiPagRes, ApiRes } from "src/type/custom-response.type";
import { GetBlogOutDto } from "../dto/get-blog.out.dto";
import { SUCCESS } from "src/contants/response.constant";

@ApiTags('Blog')
@Controller('blog')
export class BlogController {
    constructor(private readonly blogService: BlogService) { }

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
}