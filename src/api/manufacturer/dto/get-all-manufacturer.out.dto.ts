import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllManufacturersOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Number })
    product_count: number;
}

export class GetAllManufacturersPagDto extends ApiPag {
    @ApiProperty({ type: GetAllManufacturersOutDto, isArray: true })
    declare items: GetAllManufacturersOutDto[];
}

export class GetAllManufacturersOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllManufacturersPagDto })
    declare data: GetAllManufacturersPagDto;
}



