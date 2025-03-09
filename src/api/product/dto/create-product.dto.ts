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
import { ProductStatus } from '../../../database/entities/product/product.entity';

export class CreateProductDto {
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'slug is required' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'description is required' })
  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  thumbnail?: string;

  @IsNotEmpty({ message: 'sku is required' })
  @IsString()
  sku: string;

  @IsNotEmpty({ message: 'price is required' })
  @IsNumber()
  @Type(() => Number)
  price: number;

  @IsNotEmpty({ message: 'status is required' })
  @IsEnum(ProductStatus)
  status: ProductStatus;

  @IsNotEmpty({ message: 'quantity is required' })
  @IsNumber()
  @Type(() => Number)
  quantity: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  sold?: number;

  @IsNotEmpty({ message: 'featured is required' })
  @IsBoolean()
  @Type(() => Boolean)
  featured: boolean;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  discount?: number;

  // Liên kết với bảng khác
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  categoryId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  brandId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  manufacturerId?: number;

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      try {
        return JSON.parse(value);
      } catch (error) {
        return [];
      }
    }
    return value;
  })
  tagNames: string[];
}
