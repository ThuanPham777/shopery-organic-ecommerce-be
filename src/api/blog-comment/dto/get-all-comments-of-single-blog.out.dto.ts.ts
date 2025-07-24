import { ApiProperty } from "@nestjs/swagger";
import { User } from "src/database/entities/user/user.entity";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";
import { Blog } from "src/database/entities/blog/blog.entity";

export class GetAllCommentsOfSingleBlogOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    content: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    updated_at: Date;

    @ApiProperty({ type: Date })
    deleted_at: Date;

    @ApiProperty({ type: Object })
    blog: Blog;

    @ApiProperty({ type: Object })
    user: User;
}


export class GetAllCommentsOfSingleProductPagDto extends ApiPag {
    @ApiProperty({ type: GetAllCommentsOfSingleBlogOutDto, isArray: true })
    declare items: GetAllCommentsOfSingleBlogOutDto[];
}

export class GetAllCommentsOfSingleBlogOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllCommentsOfSingleProductPagDto })
    declare data: GetAllCommentsOfSingleProductPagDto;
}
