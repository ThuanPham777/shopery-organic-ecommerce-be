// product/product.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Admin / Product')
@Controller('amdin/product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  async getProducts() {
    return this.productService.getProducts();
  }

  @Get(':productId')
  @UseGuards(JwtAuthGuard)
  async getProduct(@Param('productId') productId: number) {
    return this.productService.getProduct(productId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, thumbnail);
  }
  @Patch(':productId/update')
  @UseGuards(JwtAuthGuard)
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
  @UseGuards(JwtAuthGuard)
  async deleteProductById(@Param('productId') productId: number) {
    return this.productService.deleteProductById(productId);
  }

  // Handle with product Images
  @Get(':productId/Images')
  @UseGuards(JwtAuthGuard)
  async getProductImages(@Param('productId') productId: number) {
    return this.productService.getProductImages(productId);
  }

  @Post(':productId/images/add')
  @UseInterceptors(FilesInterceptor('images', 10))
  @UseGuards(JwtAuthGuard)
  async uploadProductImages(
    @Param('productId') productId: number,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productService.uploadProductImages(productId, images);
  }

  @Patch(':productId/images/:imageId/update')
  @UseInterceptors(FileInterceptor('newImage'))
  @UseGuards(JwtAuthGuard)
  async updateProductImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
    @UploadedFile() newImage: Express.Multer.File,
  ) {
    return this.productService.updateProductImage(productId, imageId, newImage);
  }

  // delete a single product image
  @Delete(':productId/images/:imageId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteProductImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
  ) {
    return this.productService.deleteProductImage(productId, imageId);
  }

  // delete all images
  @Delete(':productId/images/delete')
  @UseGuards(JwtAuthGuard)
  async deleteAllProductImages(@Param('productId') productId: number) {
    return this.productService.deleteAllProductImages(productId);
  }
}
