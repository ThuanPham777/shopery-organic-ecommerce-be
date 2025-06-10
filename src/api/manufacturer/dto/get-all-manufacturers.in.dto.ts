import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiPagReq } from 'src/type/custom-response.type';

export class GetAllManufacturersInDto extends ApiPagReq {
    @ApiPropertyOptional({
        type: String,
        description: 'Search by manufacturer name',
    })
    @IsOptional()
    @IsString()
    search?: string;
}
