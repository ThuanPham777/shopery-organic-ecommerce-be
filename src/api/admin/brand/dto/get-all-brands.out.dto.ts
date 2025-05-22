import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllBrandsOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class GetAllBrandsPagDto extends ApiPag {
    @ApiProperty({ type: GetAllBrandsOutDto, isArray: true })
    declare items: GetAllBrandsOutDto[];
}

export class GetAllBrandsOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllBrandsPagDto })
    declare data: GetAllBrandsPagDto;
}