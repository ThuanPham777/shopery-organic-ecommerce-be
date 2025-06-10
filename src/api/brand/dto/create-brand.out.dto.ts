import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class CreateBrandOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;
}

export class CreateBrandOutRes extends ApiRes<CreateBrandOutDto> {
    @ApiProperty({ type: CreateBrandOutDto })
    declare data: CreateBrandOutDto;
}