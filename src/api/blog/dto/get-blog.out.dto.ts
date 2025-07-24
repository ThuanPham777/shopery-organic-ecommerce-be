import { ApiProperty } from "@nestjs/swagger";
import { BlogCategory } from "src/database/entities/blog/blog-category.entity";
import { BlogTag } from "src/database/entities/blog/blog-tags.entity";
import { User } from "src/database/entities/user/user.entity";
export class GetBlogOutDto {
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

    @ApiProperty({ description: 'User ID of the blog' })
    user: User;

    @ApiProperty({ description: 'Created at of the blog' })
    created_at: Date;

    @ApiProperty({ description: 'Modify at of the blog' })
    modified_at: Date;

    @ApiProperty({ description: 'Deleted at of the blog' })
    deleted_at: Date;
}