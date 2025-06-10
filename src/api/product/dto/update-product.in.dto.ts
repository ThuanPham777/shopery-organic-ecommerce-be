import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ProductStatus } from 'src/database/entities/product/product.entity';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateProductInDto {
  @ApiPropertyOptional({
    example: 'Fresh Organic Apple',
    description: 'Product name to update (optional)',
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({
    example: 'fresh-organic-apple',
    description: 'Slug for the product URL (optional)',
  })
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiPropertyOptional({
    example: 'A delicious and fresh organic apple from the farm.',
    description: 'Product description (optional)',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    example: 'https://example.com/images/apple-thumbnail.jpg',
    description: 'URL of the product thumbnail (optional)',
  })
  @IsOptional()
  @IsString()
  thumbnail?: string;

  @ApiPropertyOptional({
    example: ['https://shopery-organic.com/images/products/organic-avocado.jpg', 'https://shopery-organic.com/images/products/organic-avocado.jpg'],
    description: 'List of image URLs for the product',
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @ApiPropertyOptional({
    example: 'SKU12345',
    description: 'Stock Keeping Unit (SKU) for the product (optional)',
  })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({
    example: 2.99,
    description: 'Product price (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  price?: number;

  @ApiPropertyOptional({
    example: 'In Stock',
    description: 'Product status (optional)',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({
    example: 100,
    description: 'Product quantity in stock (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional({
    example: 50,
    description: 'Number of products sold (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sold?: number;

  @ApiPropertyOptional({
    example: true,
    description: 'Whether the product is featured (optional)',
  })
  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  featured?: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Discount percentage for the product (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  // Relating to other tables
  @ApiPropertyOptional({
    example: 1,
    description: 'Category ID (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'Brand ID (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId?: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'Manufacturer ID (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  manufacturerId?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Array of tag IDs associated with the product',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];
}
