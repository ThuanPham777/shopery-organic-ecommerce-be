import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllCategoriesOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    slug: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: String })
    image: string;
}

export class GetAllCategoriesPagDto extends ApiPag {
    @ApiProperty({ type: GetAllCategoriesOutDto, isArray: true })
    declare items: GetAllCategoriesOutDto[];
}

export class GetAllCategoriesOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllCategoriesPagDto })
    declare data: GetAllCategoriesPagDto;
}
