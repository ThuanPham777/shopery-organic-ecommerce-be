import { ApiProperty } from "@nestjs/swagger";
import { Blog } from "src/database/entities/blog/blog.entity";
import { User } from "src/database/entities/user/user.entity";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateCommentOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({
        type: String,
    })
    content: string;

    @ApiProperty({
        type: Object,
    })
    blog: Blog;

    @ApiProperty({
        type: Object,
    })
    user: User;

    @ApiProperty({
        type: Date,
    })
    created_at: Date;

    @ApiProperty({
        type: Date,
    })
    modified_at: Date;
}


export class UpdateCommentOutRes extends ApiRes<UpdateCommentOutDto> {
    @ApiProperty({ type: UpdateCommentOutDto })
    declare data: UpdateCommentOutDto;
}
