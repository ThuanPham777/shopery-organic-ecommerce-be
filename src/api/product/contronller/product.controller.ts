// product/product.controller.ts
import { Controller, Get } from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { Product } from '../../../database/entities/product/product.entity';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  async getAll(): Promise<Product[]> {
    return await this.productService.getAllProducts();
  }
}
