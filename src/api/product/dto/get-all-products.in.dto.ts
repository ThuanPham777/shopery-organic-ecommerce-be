import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiPagReq } from 'src/type/custom-response.type';

export class GetAllProductsInDto extends ApiPagReq {
  @ApiPropertyOptional({
    example: 'fruits',
    description: 'Filter products by category slug',
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({
    example: 'green-farm',
    description: 'Filter products by manufacturer name',
  })
  @IsOptional()
  @IsString()
  manufacturer?: string;

  @ApiPropertyOptional({
    example: 'eco-brand',
    description: 'Filter products by brand name',
  })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiPropertyOptional({
    example: 'organic',
    description: 'Filter products by tag (e.g., organic, vegan, fresh)',
  })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({
    example: 10,
    description: 'Minimum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({
    example: 100,
    description: 'Maximum price filter',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({
    example: 4,
    description: 'Minimum average rating (1 to 5)',
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  rating?: number;

  @ApiPropertyOptional({ type: 'string', nullable: true, required: false })
  @Type(() => String)
  @IsOptional()
  search?: string;
}
