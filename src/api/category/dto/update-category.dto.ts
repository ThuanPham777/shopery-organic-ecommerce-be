import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class updateCategoryDto {
  @ApiPropertyOptional({
    example: 'Organic Fruits',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'organic-fruits',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'A variety of fresh, certified organic fruits from trusted farms.',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://shopery-organic.com/images/categories/organic-fruits.jpg',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
