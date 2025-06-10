import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { IsOptional } from 'class-validator';
import { ApiPagReq } from 'src/type/custom-response.type';

export class GetAllBrandsInDto extends ApiPagReq {
    @ApiPropertyOptional({
        type: String,
        description: 'Search by brand name',
    })
    @IsOptional()
    @IsString()
    search?: string;
}
