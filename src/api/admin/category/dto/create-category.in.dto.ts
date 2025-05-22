import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCategoryInDto {
  @ApiProperty({
    example: 'Organic Vegetables',
    description: 'The name of the product category',
  })
  @IsNotEmpty({ message: 'Name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'organic-vegetables',
    description: 'Slug for the category, used in URLs (lowercase, no spaces)',
  })
  @IsNotEmpty({ message: 'Slug is required' })
  @IsString()
  slug: string;

  @ApiProperty({
    example:
      'Fresh organic vegetables grown without chemical fertilizers or pesticides.',
    description: 'Detailed description of the category',
  })
  @IsNotEmpty({ message: 'Description is required' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example:
      'https://shopery-organic.com/images/categories/organic-vegetables.jpg',
    description: 'Optional image URL for the category',
  })
  @IsOptional()
  @IsString()
  image?: string;
}
