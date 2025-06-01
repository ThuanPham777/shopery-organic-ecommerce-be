import { ApiProperty } from "@nestjs/swagger";
import { AddressType } from "src/database/entities/address/address.entity";
import { ApiRes } from "src/type/custom-response.type";

export class CreateAddressOutDto {
    @ApiProperty({ description: 'ID của địa chỉ' })
    id: number;

    @ApiProperty({ description: 'Địa chỉ chi tiết' })
    address: string;

    @ApiProperty({ description: 'Tên thành phố' })
    city: string;

    @ApiProperty({ description: 'Tên tỉnh' })
    state: string;

    @ApiProperty({ description: 'Mã vùng' })
    zip_code: string;

    @ApiProperty({ description: 'Loại địa chỉ' })
    address_type: AddressType;
}

export class CreateAddressOutRes extends ApiRes<CreateAddressOutDto> {
    @ApiProperty({ type: CreateAddressOutDto })
    declare data: CreateAddressOutDto;
}
