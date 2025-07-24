import { BlogTag } from "src/database/entities/blog/blog-tags.entity";
import { BlogTagAdminController } from "./controller/blogTag.admin.controller";
import { BlogTagController } from "./controller/blogTag.controller";
import { BlogTagService } from "./service/blogTag.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([BlogTag])],
    controllers: [BlogTagController, BlogTagAdminController],
    providers: [BlogTagService],
})
export class BlogTagModule { }