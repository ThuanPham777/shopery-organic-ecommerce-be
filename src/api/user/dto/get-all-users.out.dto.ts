import { ApiProperty } from "@nestjs/swagger";
import { EUserStatus } from "src/enums/user.enums";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";

export class GetAllUsersOutDto {
    @ApiProperty({ type: Number })
    id: number;

    @ApiProperty({ type: String })
    username: string;

    @ApiProperty({ type: String })
    first_name: string;

    @ApiProperty({ type: String })
    last_name: string;

    @ApiProperty({ type: String })
    email: string;

    @ApiProperty({ type: String })
    phone_number: string;

    @ApiProperty({ type: String })
    avatar_url: string;

    @ApiProperty({ type: String })
    status: EUserStatus;
}

export class GetAllUsersPagDto extends ApiPag {
    @ApiProperty({ type: GetAllUsersOutDto, isArray: true })
    declare items: GetAllUsersOutDto[];
}

export class GetAllUsersOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllUsersPagDto })
    declare data: GetAllUsersPagDto;
}

