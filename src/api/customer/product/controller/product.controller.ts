// product/product.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { ApiTags } from '@nestjs/swagger';
import { GetAllProducts } from '../dto/get-all-products.dto.';
import { ApiPagRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: GetAllProducts) {
    const { page, perPage } = query;
    const result = await this.productService.getProducts(query);

    return new ApiPagRes(result.products, result.total, page, perPage, SUCCESS);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: number) {
    return this.productService.getProduct(productId);
  }
}
