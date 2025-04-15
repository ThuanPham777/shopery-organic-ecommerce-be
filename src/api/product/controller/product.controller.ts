// product/product.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { GetProductsDto } from '../dto/get-products.dto.';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: GetProductsDto) {
    return this.productService.getProducts(query);
  }

  @Get(':productId')
  async getProduct(@Param('productId') productId: number) {
    console.log('getProduct', productId);
    return this.productService.getProduct(productId);
  }

  @Post('create')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, thumbnail);
  }
  @Patch(':productId/update')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async updateProduct(
    @Param('productId') productId: number,
    @Body() updateProductDto: UpdateProductDto,
    @UploadedFile() thumbnail?: Express.Multer.File,
  ) {
    return this.productService.updateProduct(
      productId,
      updateProductDto,
      thumbnail,
    );
  }

  @Delete(':productId/delete')
  async deleteProductById(@Param('productId') productId: number) {
    return this.productService.deleteProductById(productId);
  }

  // Handle with product Images
  @Get(':productId/Images')
  async getProductImages(@Param('productId') productId: number) {
    return this.productService.getProductImages(productId);
  }

  @Post(':productId/images/add')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadProductImages(
    @Param('productId') productId: number,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productService.uploadProductImages(productId, images);
  }

  @Patch(':productId/images/:imageId/update')
  @UseInterceptors(FileInterceptor('newImage'))
  async updateProductImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
    @UploadedFile() newImage: Express.Multer.File,
  ) {
    return this.productService.updateProductImage(productId, imageId, newImage);
  }

  // delete a single product image
  @Delete(':productId/images/:imageId/delete')
  async deleteProductImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
  ) {
    return this.productService.deleteProductImage(productId, imageId);
  }

  // delete all images
  @Delete(':productId/images/delete')
  async deleteAllProductImages(@Param('productId') productId: number) {
    return this.productService.deleteAllProductImages(productId);
  }
}
