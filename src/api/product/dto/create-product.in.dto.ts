import { Transform, Type } from 'class-transformer';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsBoolean,
  IsArray,
} from 'class-validator';
import { ProductStatus } from 'src/database/entities/product/product.entity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductInDto {
  @ApiProperty({
    example: 'Organic Avocado',
    description: 'The name of the product',
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'organic-avocado',
    description: 'Slug for the product used in URLs (must be unique)',
  })
  @IsNotEmpty({ message: 'slug is required' })
  @IsString()
  slug: string;

  @ApiProperty({
    example: 'Fresh organic avocados rich in healthy fats and nutrients.',
    description: 'Short description of the product',
  })
  @IsNotEmpty({ message: 'short_description is required' })
  @IsString()
  short_description: string;

  @ApiProperty({
    example: 'Fresh organic avocados rich in healthy fats and nutrients.',
    description: 'Detailed description of the product',
  })
  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description: string;

  @ApiPropertyOptional({
    example: 'https://shopery-organic.com/images/products/organic-avocado.jpg',
    description: 'Thumbnail image URL for the product',
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

  @ApiProperty({
    example: 'AVO12345',
    description: 'Unique stock keeping unit identifier',
  })
  @IsNotEmpty({ message: 'sku is required' })
  @IsString()
  sku: string;

  @ApiProperty({
    example: 4.99,
    description: 'Price of the product in USD',
  })
  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @ApiProperty({
    example: 'IN_STOCK',
    enum: ProductStatus,
    description: 'Current availability status of the product',
  })
  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @ApiProperty({
    example: 150,
    description: 'Total quantity available in stock',
  })
  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @ApiPropertyOptional({
    example: 25,
    description: 'Number of units sold (optional)',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sold?: number;

  @ApiProperty({
    example: true,
    description: 'Indicates whether the product is marked as featured',
  })
  @IsNotEmpty({ message: 'featured is required' })
  @IsBoolean()
  @Type(() => Boolean)
  featured: boolean;

  @ApiPropertyOptional({
    example: 10,
    description: 'Discount percentage applied to the product',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  @ApiPropertyOptional({
    example: 2,
    description: 'ID of the category this product belongs to',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId: number;

  @ApiPropertyOptional({
    example: 1,
    description: 'ID of the brand associated with this product',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId: number;

  @ApiPropertyOptional({
    example: 3,
    description: 'ID of the manufacturer that produces this product',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  manufacturerId: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
    description: 'Array of tag IDs associated with the product',
  })
  @IsArray()
  @IsNumber({}, { each: true })
  @IsOptional()
  tagIds?: number[];
}
