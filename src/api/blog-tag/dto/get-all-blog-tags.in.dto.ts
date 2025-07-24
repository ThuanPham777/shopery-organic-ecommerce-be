import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { ApiPagReq } from 'src/type/custom-response.type';

export class GetAllBlogTagsInDto extends ApiPagReq {
    @ApiPropertyOptional({
        type: String,
        description: 'Search by tag name',
    })
    @IsOptional()
    @IsString()
    search?: string;
}
