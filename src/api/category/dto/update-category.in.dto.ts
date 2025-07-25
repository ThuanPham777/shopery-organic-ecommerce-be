import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class UpdateCategoryInDto {
  @ApiPropertyOptional({
    example: 'Organic Fruits',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name?: string;

  @ApiPropertyOptional({
    example: 'organic-fruits',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  slug?: string;

  @ApiPropertyOptional({
    example: 'A variety of fresh, certified organic fruits from trusted farms.',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  description?: string;

  @ApiPropertyOptional({
    example: 'https://shopery-organic.com/images/categories/organic-fruits.jpg',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  image?: string;
}
