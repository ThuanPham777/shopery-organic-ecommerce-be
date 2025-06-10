import { ApiProperty } from "@nestjs/swagger";
import { EUserStatus } from "src/enums/user.enums";
import { ApiPag, ApiPagReq } from "src/type/custom-response.type";

export class GetAllUsersInDto extends ApiPagReq {
    @ApiProperty({ description: 'Tên người dùng' })
    search?: string;

    @ApiProperty({ description: 'Trạng thái người dùng' })
    status?: EUserStatus;
}