import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";
import { INVALID_STRING } from "src/contants/invalid.constant";

export class CreateBlogInDto {
    @ApiProperty({ description: 'Title of the blog' })
    @IsNotEmpty({ message: INVALID_STRING })
    @IsString()
    title: string;

    @ApiProperty({ description: 'Description of the blog' })
    @IsNotEmpty({ message: INVALID_STRING })
    @IsString()
    description: string;

    @ApiProperty({ description: 'Slug of the blog' })
    @IsNotEmpty({ message: INVALID_STRING })
    @IsString()
    slug: string;

    @ApiProperty({ description: 'Thumbnail of the blog' })
    @IsNotEmpty({ message: INVALID_STRING })
    @IsString()
    thumbnail: string;

    @ApiProperty({ description: 'Category ID of the blog' })
    @IsNotEmpty()
    @IsNumber()
    categoryId: number;

    @ApiProperty({ description: 'Tags of the blog' })
    @IsNotEmpty()
    @IsArray()
    tagIds: number[];

    @ApiProperty({ description: 'User ID of the blog' })
    @IsNotEmpty()
    @IsNumber()
    userId: number;
}
