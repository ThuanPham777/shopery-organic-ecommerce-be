import { Repository } from 'typeorm';
import { User } from 'src/database/entities/user/user.entity';
import { ForbiddenException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { EUserRole } from 'src/enums/user.enums';
import { BlogComment } from 'src/database/entities/blog/blog-comment.entity';
import { Blog } from 'src/database/entities/blog/blog.entity';
import { GetAllCommentsOfSingleBlogInDto } from '../dto/get-all-comments-of-single-blog.in.dto';
import { CreateCommentInDto } from '../dto/create-comment.in.dto';
import { UpdateCommentInDto } from '../dto/update-comment.in.dto';
export class BlogCommentService {
    constructor(
        @InjectRepository(BlogComment)
        private blogCommentRepository: Repository<BlogComment>,
        @InjectRepository(Blog)
        private blogRepository: Repository<Blog>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) { }

    async getAllCommentsOfSingleBlog(
        query: GetAllCommentsOfSingleBlogInDto,
        blogId: number,
    ): Promise<{ comments: BlogComment[]; total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
        const skip = (page - 1) * perPage;
        const take = perPage;
        const [comments, total] = await this.blogCommentRepository.findAndCount({
            where: { blog: { id: blogId } },
            relations: ['user'],
            skip,
            take,
        });

        return {
            comments,
            total,
        };
    }

    async createBlogComment(
        data: CreateCommentInDto,
        blogId: number,
        jwtPayload: { userId: number },
    ): Promise<BlogComment> {
        const blog = await this.blogRepository.findOne({
            where: { id: blogId },
        });
        if (!blog) {
            throw new NotFoundException(`Product #${blogId} not found`);
        }

        const user = await this.userRepository.findOneBy({
            id: jwtPayload.userId,
        });
        if (!user)
            throw new NotFoundException(`User #${jwtPayload.userId} not found`);

        const comment = this.blogCommentRepository.create({
            content: data.content,
            blog,
            user,
        });

        const newComment = await this.blogCommentRepository.save(comment);

        return newComment;
    }

    async updateBlogComment(
        data: UpdateCommentInDto,
        blogId: number,
        jwtPayload: { userId: number },
    ): Promise<BlogComment> {
        const blogComment = await this.blogCommentRepository.findOne({
            where: { id: blogId },
            relations: ['user'],
        });
        if (!blogComment) {
            throw new NotFoundException(`blogComment #${blogId} not found`);
        }

        // 2. Kiểm tra quyền (chỉ owner mới được sửa)
        if (blogComment.user.id !== jwtPayload.userId) {
            throw new ForbiddenException('You cannot edit this blogComment');
        }
        if (data.content !== undefined) {
            blogComment.content = data.content;
        }

        blogComment.modified_at = new Date();

        const updatedComment = await this.blogCommentRepository.save(blogComment);

        return updatedComment;
    }

    async deleteBlogComment(
        blogId: number,
        jwtPayload: { userId: number; role: EUserRole },
    ): Promise<boolean> {
        // 1. Lấy blogComment (bao gồm thông tin user)
        const blogComment = await this.blogCommentRepository.findOne({
            where: { id: blogId },
            relations: ['user'],
            withDeleted: false, // chỉ lấy những blogComment chưa xóa
        });

        if (!blogComment) {
            // không tìm thấy hoặc đã xóa
            return false;
        }

        // 2. Chỉ chủ sở hữu (hoặc admin) mới được xóa
        if (
            blogComment.user.id !== jwtPayload.userId &&
            jwtPayload.role !== EUserRole.ADMIN
        ) {
            throw new ForbiddenException('You cannot delete this blogComment');
        }

        // 3. Soft-delete (đánh dấu deleted_at)
        await this.blogCommentRepository.softRemove(blogComment);
        // hoặc: await this.blogCommentRepo.softDelete(blogId);

        return true;
    }
}
