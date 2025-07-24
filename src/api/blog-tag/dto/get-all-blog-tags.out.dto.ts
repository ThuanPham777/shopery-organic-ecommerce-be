import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export default class GetAllBlogTagsOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Number })
    blog_count: number;

}

export class GetAllTagsPagDto extends ApiPag {
    @ApiProperty({ type: GetAllBlogTagsOutDto, isArray: true })
    declare items: GetAllBlogTagsOutDto[];
}

export class GetAllBlogTagsOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllTagsPagDto })
    declare data: GetAllTagsPagDto;
}
