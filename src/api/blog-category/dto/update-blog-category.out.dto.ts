import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateBlogCategoryOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    name: string;

    @ApiProperty({ type: String })
    slug: string;

    @ApiProperty({ type: String })
    description: string;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class UpdateBlogCategoryOutRes extends ApiRes {
    @ApiProperty({ type: UpdateBlogCategoryOutDto })
    declare data: UpdateBlogCategoryOutDto;
}