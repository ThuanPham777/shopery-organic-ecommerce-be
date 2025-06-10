import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateBrandOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class UpdateBrandOutRes extends ApiRes<UpdateBrandOutDto> {
    @ApiProperty({ type: UpdateBrandOutDto })
    declare data: UpdateBrandOutDto;
}


