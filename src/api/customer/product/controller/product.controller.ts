// product/product.controller.ts
import {
  Controller,
  Get,
  Param,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

import { ApiPagRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { ProductService } from '../service/product.service';
import { GetAllProductsInDto } from '../dto/get-all-products.in.dto';
import { GetAllProductsOutRes } from '../dto/get-all-products.out.dto';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: GetAllProductsOutRes })
  async getAllProducts(@Query() query: GetAllProductsInDto) {
    const { page, perPage } = query;
    const result = await this.productService.getAllProducts(query);

    return new ApiPagRes(result.products, result.total, page, perPage, SUCCESS);
  }

  @Get(':productId')
  async getProductById(@Param('productId') productId: number) {
    return this.productService.getProductById(productId);
  }
}
