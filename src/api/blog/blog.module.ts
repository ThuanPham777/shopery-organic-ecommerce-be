import { TypeOrmModule } from "@nestjs/typeorm";
import { BlogAdminController } from "./controller/blog.admin.controller";
import { BlogController } from "./controller/blog.controller";
import { BlogService } from "./service/blog.service";
import { Module } from "@nestjs/common";
import { Blog } from "src/database/entities/blog/blog.entity";
import { BlogCategory } from "src/database/entities/blog/blog-category.entity";
import { BlogTag } from "src/database/entities/blog/blog-tags.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([
            Blog,
            BlogCategory,
            BlogTag
        ]),
    ],
    controllers: [BlogController, BlogAdminController],
    providers: [BlogService],
})
export class BlogModule { }