import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlogComment } from "src/database/entities/blog/blog-comment.entity";
import { BlogCommentController } from "./controller/blogComment.controller";
import { BlogCommentAdminController } from "./controller/blogComment.admin.controller";
import { BlogCommentService } from "./service/blogComment.service";
import { Blog } from 'src/database/entities/blog/blog.entity';
import { User } from 'src/database/entities/user/user.entity';


@Module({
    imports: [TypeOrmModule.forFeature([BlogComment, Blog, User])],
    controllers: [BlogCommentController, BlogCommentAdminController],
    providers: [BlogCommentService],
})
export class BlogCommentModule { }