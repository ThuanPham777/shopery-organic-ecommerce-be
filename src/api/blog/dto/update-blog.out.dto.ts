import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { BlogCategory } from "src/database/entities/blog/blog-category.entity";
import { BlogTag } from "src/database/entities/blog/blog-tags.entity";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateBlogOutDto {
    @ApiProperty({ description: 'ID of the blog' })
    id: number;

    @ApiProperty({ description: 'Title of the blog' })
    title: string;

    @ApiProperty({ description: 'Description of the blog' })
    description: string;

    @ApiProperty({ description: 'Slug of the blog' })
    slug: string;

    @ApiProperty({ description: 'Thumbnail of the blog' })
    thumbnail: string;

    @ApiProperty({ description: 'Category ID of the blog' })
    category: BlogCategory;

    @ApiProperty({ description: 'Tags of the blog' })
    tags: BlogTag[];

    @ApiProperty({ description: 'Modified at of the blog' })
    modified_at: Date;
}

export class UpdateBlogOutRes extends ApiRes<UpdateBlogOutDto> {
    @ApiProperty({ type: UpdateBlogOutDto })
    declare data: UpdateBlogOutDto;
}

