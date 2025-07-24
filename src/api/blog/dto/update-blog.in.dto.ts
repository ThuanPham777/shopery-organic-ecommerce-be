import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class UpdateBlogInDto {
    @ApiProperty({ description: 'Title of the blog' })
    @IsOptional()
    @IsString()
    title: string;

    @ApiProperty({ description: 'Description of the blog' })
    @IsOptional()
    @IsString()
    description: string;

    @ApiProperty({ description: 'Slug of the blog' })
    @IsOptional()
    @IsString()
    slug: string;

    @ApiProperty({ description: 'Thumbnail of the blog' })
    @IsOptional()
    @IsString()
    thumbnail: string;

    @ApiProperty({ description: 'Category ID of the blog' })
    @IsOptional()
    @IsNumber()
    categoryId: number;

    @ApiProperty({ description: 'Tags of the blog' })
    @IsOptional()
    @IsArray()
    tagIds: number[];
}