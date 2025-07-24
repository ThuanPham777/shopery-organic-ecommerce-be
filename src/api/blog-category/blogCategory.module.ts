import { BlogCategory } from "src/database/entities/blog/blog-category.entity";
import { BlogCategoryAdminController } from "./controller/blogCategory.controller";
import { BlogCategoryService } from "./service/blogCategory.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Module } from "@nestjs/common";

@Module({
    imports: [TypeOrmModule.forFeature([BlogCategory])],
    controllers: [BlogCategoryAdminController, BlogCategoryAdminController],
    providers: [BlogCategoryService],
})
export class BlogCategoryModule { }