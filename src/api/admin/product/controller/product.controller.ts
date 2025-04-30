// product/product.controller.ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Query,
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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllProducts } from '../dto/get-all-products.dto';
import { ApiPagRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Admin / Product')
@Controller('admin/product')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async getProducts(@Query() query: GetAllProducts) {
    const { page, perPage } = query;
    const result = await this.productService.getProducts(query);

    return new ApiPagRes(result.products, result.total, page, perPage, SUCCESS);
  }

  @Get(':productId')
  @Roles('admin')
  async getProduct(@Param('productId') productId: number) {
    return this.productService.getProduct(productId);
  }

  @Post('create')
  @Roles('admin')
  @UseInterceptors(FileInterceptor('thumbnail'))
  async createProduct(
    @Body() createProductDto: CreateProductDto,
    @UploadedFile() thumbnail: Express.Multer.File,
  ) {
    return this.productService.createProduct(createProductDto, thumbnail);
  }
  @Patch(':productId/update')
  @Roles('admin')
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
  @Roles('admin')
  async deleteProductById(@Param('productId') productId: number) {
    return this.productService.deleteProductById(productId);
  }

  // Handle with product Images
  @Get(':productId/Images')
  @Roles('admin')
  async getProductImages(@Param('productId') productId: number) {
    return this.productService.getProductImages(productId);
  }

  @Post(':productId/images/add')
  @Roles('admin')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadProductImages(
    @Param('productId') productId: number,
    @UploadedFiles() images: Express.Multer.File[],
  ) {
    return this.productService.uploadProductImages(productId, images);
  }

  @Patch(':productId/images/:imageId/update')
  @Roles('admin')
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
  @Roles('admin')
  async deleteProductImage(
    @Param('productId') productId: number,
    @Param('imageId') imageId: number,
  ) {
    return this.productService.deleteProductImage(productId, imageId);
  }

  // delete all images
  @Delete(':productId/images/delete')
  @Roles('admin')
  async deleteAllProductImages(@Param('productId') productId: number) {
    return this.productService.deleteAllProductImages(productId);
  }
}
