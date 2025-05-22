import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";
import { CreateCategoryInDto } from "./create-category.in.dto";

export class CreateCategoryOutDto {
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

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class CreateCategoryOutRes extends ApiRes {
    @ApiProperty({ type: CreateCategoryOutDto })
    declare data: CreateCategoryOutDto;
}

export class CreateCategoryInRes extends ApiRes {
    @ApiProperty({ type: CreateCategoryInDto })
    declare data: CreateCategoryInDto;
}
