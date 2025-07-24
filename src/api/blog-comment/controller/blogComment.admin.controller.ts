import {
    Controller,
    Delete,
    Param,
    UseGuards,
    ParseIntPipe,
    Request,
    Get,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    ApiNullableRes,
    ApiPagRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { BlogCommentService } from '../service/blogComment.service';
import { GetAllCommentsOfSingleBlogOutRes } from '../dto/get-all-comments-of-single-blog.out.dto.ts';
import { GetAllCommentsOfSingleBlogInDto } from '../dto/get-all-comments-of-single-blog.in.dto';
@ApiTags('Admin / blogComment')
@ApiBearerAuth()
@Controller('admin/blogComment')
export class BlogCommentAdminController {
    constructor(private readonly blogCommentService: BlogCommentService) { }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(EUserRole.ADMIN)
    @Delete(':blogCommentId')
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteBlogComment(
        @Param('blogCommentId', ParseIntPipe) blogCommentId: number,
        @Request() req, // inject user từ JWT
    ) {
        await this.blogCommentService.deleteBlogComment(blogCommentId, {
            userId: req.user.userId,
            role: req.user.role,
        });

        return new ApiNullableRes(null, SUCCESS);
    }

    @Get(':blogId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllCommentsOfSingleBlogOutRes })
    async getAllCommentsOfSingleBlog(
        @Query() query: GetAllCommentsOfSingleBlogInDto,
        @Param('blogId') blogId: number,
    ) {
        const { page, perPage } = query;
        const result = await this.blogCommentService.getAllCommentsOfSingleBlog(
            query,
            blogId,
        );
        return new ApiPagRes(result.comments, result.total, page, perPage, SUCCESS);
    }
}
