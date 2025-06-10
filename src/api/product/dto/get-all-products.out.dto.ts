import { ApiProperty } from "@nestjs/swagger";
import { ApiPag, ApiPagRes } from "src/type/custom-response.type";
import { ProductStatus } from "src/database/entities/product/product.entity";

export class GetAllProductsOutDto {
    @ApiProperty({ example: 1, description: 'Product ID' })
    id: number;

    @ApiProperty({ example: 'Organic Avocado', description: 'Product name' })
    name: string;

    @ApiProperty({ example: 'organic-avocado', description: 'Product slug' })
    slug: string;

    @ApiProperty({ example: 'Fresh organic avocados...', description: 'Product description' })
    description: string;

    @ApiProperty({ example: 'https://example.com/thumbnail.jpg', description: 'Product thumbnail' })
    thumbnail: string;

    @ApiProperty({ example: 'AVO12345', description: 'Product SKU' })
    sku: string;

    @ApiProperty({ example: 4.99, description: 'Product price' })
    price: number;

    @ApiProperty({ enum: ProductStatus, example: ProductStatus.IN_STOCK, description: 'Product status' })
    status: ProductStatus;

    @ApiProperty({ example: 100, description: 'Available quantity' })
    quantity: number;

    @ApiProperty({ example: 50, description: 'Number of units sold' })
    sold: number;

    @ApiProperty({ example: true, description: 'Whether product is featured' })
    featured: boolean;

    @ApiProperty({ example: 10, description: 'Discount percentage' })
    discount: number;

    @ApiProperty({ example: 'Fruits', description: 'Category name' })
    category: string;

    @ApiProperty({ example: 'Organic Valley', description: 'Brand name' })
    brand: string;

    @ApiProperty({ example: 'Nature\'s Best', description: 'Manufacturer name' })
    manufacturer: string;

    @ApiProperty({ example: ['organic', 'fresh'], description: 'Product tags' })
    tags: string[];

    @ApiProperty({ example: ['https://example.com/image1.jpg'], description: 'Product images' })
    images: string[];
}

export class GetAllProductsPagDto extends ApiPag {
    @ApiProperty({ type: GetAllProductsOutDto, isArray: true })
    declare items: GetAllProductsOutDto[];
}

export class GetAllProductsOutRes extends ApiPagRes {
    @ApiProperty({ type: GetAllProductsPagDto })
    declare data: GetAllProductsPagDto;
}
