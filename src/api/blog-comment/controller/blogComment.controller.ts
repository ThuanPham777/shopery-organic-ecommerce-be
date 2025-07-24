import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
    Body,
    Controller,
    Get,
    Param,
    ParseIntPipe,
    Patch,
    Post,
    Query,
    Request,
    UseGuards,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ApiPagRes, ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { BlogCommentService } from '../service/blogComment.service';
import { GetAllCommentsOfSingleBlogOutRes } from '../dto/get-all-comments-of-single-blog.out.dto.ts';
import { GetAllCommentsOfSingleBlogInDto } from '../dto/get-all-comments-of-single-blog.in.dto';
import { CreateCommentOutRes } from '../dto/create-comment.out.dto';
import { CreateCommentInDto } from '../dto/create-comment.in.dto';
import { UpdateCommentOutRes } from '../dto/update-comment.out.dto';
import { UpdateCommentInDto } from '../dto/update-comment.in.dto';

@ApiTags('blogComment')
@Controller('blogComment')
@ApiBearerAuth()
export class BlogCommentController {
    constructor(private readonly blogCommentService: BlogCommentService) { }

    @Get(':blogId')
    @UsePipes(new ValidationPipe({ transform: true }))
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

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(EUserRole.USER)
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({ type: CreateCommentOutRes })
    @Post('create/:blogId')
    async createBlogComment(
        @Body() data: CreateCommentInDto,
        @Param('blogId') blogId: number,
        @Request() req, // lấy thông tin user từ token
    ) {
        const newReview = await this.blogCommentService.createBlogComment(
            data,
            blogId,
            {
                userId: req.user.userId,
            },
        );
        return new ApiRes(newReview, SUCCESS);
    }

    @UseGuards(JwtAuthGuard, RoleGuard)
    @Roles(EUserRole.USER)
    @Patch(':blogCommentId')
    @UsePipes(new ValidationPipe({ transform: true }))
    @ApiOkResponse({ type: UpdateCommentOutRes })
    async updateReview(
        @Param('blogCommentId', ParseIntPipe) blogCommentId: number,
        @Body() data: UpdateCommentInDto,
        @Request() req, // lấy thông tin user từ token
    ) {
        const updatedReview = await this.blogCommentService.updateBlogComment(
            data,
            blogCommentId,
            {
                userId: req.user.userId,
            },
        );
        return new ApiRes(updatedReview, SUCCESS);
    }
}
