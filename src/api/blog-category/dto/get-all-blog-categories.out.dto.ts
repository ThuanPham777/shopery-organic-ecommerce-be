import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllBlogCategoriesOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    slug: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: Number })
    blog_count: number;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class GetAllBlogCategoriesPagDto extends ApiPag {
    @ApiProperty({ type: GetAllBlogCategoriesOutDto, isArray: true })
    declare items: GetAllBlogCategoriesOutDto[];
}

export class GetAllBlogCategoriesOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllBlogCategoriesPagDto })
    declare data: GetAllBlogCategoriesPagDto;
}
