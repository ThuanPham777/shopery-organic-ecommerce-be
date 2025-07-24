import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class CreateBlogCategoryOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    slug: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: Date })
    created_at: Date;
}

export class CreateBlogCategoryOutRes extends ApiRes {
    @ApiProperty({ type: CreateBlogCategoryOutDto })
    declare data: CreateBlogCategoryOutDto;
}
