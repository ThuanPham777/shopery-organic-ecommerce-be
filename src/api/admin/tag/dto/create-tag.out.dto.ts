import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class CreateTagOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class CreateTagOutRes extends ApiRes<CreateTagOutDto> {
    @ApiProperty({ type: CreateTagOutDto })
    declare data: CreateTagOutDto;
}
