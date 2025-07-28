import { ApiProperty } from '@nestjs/swagger';
import { ProductStatus } from 'src/database/entities/product/product.entity';
import { ApiRes } from 'src/type/custom-response.type';

export class CreateProductOutDto {
  @ApiProperty({ example: 1, description: 'Product ID' })
  id: number;

  @ApiProperty({ example: 'Organic Avocado', description: 'Product name' })
  name: string;

  @ApiProperty({ example: 'organic-avocado', description: 'Product slug' })
  slug: string;

  @ApiProperty({
    example: 'Fresh organic avocados...',
    description: 'Product short description',
  })
  short_description: string;

  @ApiProperty({
    example: 'Fresh organic avocados...',
    description: 'Product description',
  })
  description: string;

  @ApiProperty({
    example: 'https://example.com/thumbnail.jpg',
    description: 'Product thumbnail',
  })
  thumbnail: string;

  @ApiProperty({ example: 'AVO12345', description: 'Product SKU' })
  sku: string;

  @ApiProperty({ example: 4.99, description: 'Product price' })
  price: number;

  @ApiProperty({
    enum: ProductStatus,
    example: ProductStatus.IN_STOCK,
    description: 'Product status',
  })
  status: ProductStatus;

  @ApiProperty({ example: 100, description: 'Available quantity' })
  quantity: number;

  @ApiProperty({ example: true, description: 'Whether product is featured' })
  featured: boolean;

  @ApiProperty({ example: 10, description: 'Discount percentage' })
  discount: number;

  @ApiProperty({ example: 'Fruits', description: 'Category name' })
  category: string;

  @ApiProperty({ example: 'Organic Valley', description: 'Brand name' })
  brand: string;

  @ApiProperty({ example: "Nature's Best", description: 'Manufacturer name' })
  manufacturer: string;

  @ApiProperty({ example: ['organic', 'fresh'], description: 'Product tags' })
  tags: string[];

  @ApiProperty({
    example: ['https://example.com/image1.jpg'],
    description: 'Product images',
  })
  images: string[];
}

export class CreateProductOutRes extends ApiRes<CreateProductOutDto> {
  @ApiProperty({ type: CreateProductOutDto })
  declare data: CreateProductOutDto;
}
