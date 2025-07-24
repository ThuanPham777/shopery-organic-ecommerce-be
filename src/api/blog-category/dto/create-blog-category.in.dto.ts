import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class CreateBlogCategoryInDto {
  @ApiProperty({
    example: 'Organic Vegetables',
    description: 'The name of the product category',
  })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name: string;

  @ApiProperty({
    example: 'organic-vegetables',
    description: 'Slug for the category, used in URLs (lowercase, no spaces)',
  })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  slug: string;

  @ApiProperty({
    example:
      'Fresh organic vegetables grown without chemical fertilizers or pesticides.',
    description: 'Detailed description of the category',
  })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  description: string;
}
