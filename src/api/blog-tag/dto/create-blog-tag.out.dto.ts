import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class CreateBlogTagOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;
}

export class CreateBlogTagOutRes extends ApiRes<CreateBlogTagOutDto> {
    @ApiProperty({ type: CreateBlogTagOutDto })
    declare data: CreateBlogTagOutDto;
}
