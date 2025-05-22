import { ApiProperty } from "@nestjs/swagger";
import { ApiRes } from "src/type/custom-response.type";

export class UpdateBrandOutDto {
    @ApiProperty({
        example: 1,
        description: 'ID của thương hiệu',
    })
    id: number;

    @ApiProperty({
        example: 'Organic Valley',
        description: 'Tên thương hiệu',
    })
    name: string;

    @ApiProperty({ type: Date })
    created_at: Date;

    @ApiProperty({ type: Date })
    modified_at: Date;
}

export class UpdateBrandOutRes extends ApiRes<UpdateBrandOutDto> {
    @ApiProperty({ type: UpdateBrandOutDto })
    declare data: UpdateBrandOutDto;
}


