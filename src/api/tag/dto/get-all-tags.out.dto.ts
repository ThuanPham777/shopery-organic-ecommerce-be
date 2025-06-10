import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes, ApiRes } from "src/type/custom-response.type";

export default class GetAllTagsOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Number })
    product_count: number;

}

export class GetAllTagsPagDto extends ApiPag {
    @ApiProperty({ type: GetAllTagsOutDto, isArray: true })
    declare items: GetAllTagsOutDto[];
}

export class GetAllTagsOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllTagsPagDto })
    declare data: GetAllTagsPagDto;
}
