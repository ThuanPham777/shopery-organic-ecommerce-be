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
    UseGuards,
    UseInterceptors,
    UsePipes,
    ValidationPipe,
} from '@nestjs/common';
import { ProductService } from '../service/product.service';
import { CreateProductInDto } from '../dto/create-product.in.dto';
import { UpdateProductInDto } from '../dto/update-product.in.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags, ApiBody, ApiQuery, ApiOkResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllProductsInDto } from '../dto/get-all-products.in.dto';
import { ApiNullableRes, ApiPagRes, ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllProductsOutRes } from '../dto/get-all-products.out.dto';
import { CreateProductOutRes } from '../dto/create-product.out.dto';
import { UpdateProductOutRes } from '../dto/update-product.out.dto';
import { EUserRole } from 'src/enums/user.enums';

@ApiTags('Admin / Product')
@Controller('admin/product')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class ProductAdminController {
    constructor(private readonly productService: ProductService) { }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllProductsOutRes })
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllProducts(@Query() query: GetAllProductsInDto) {
        const { page, perPage } = query;
        const result = await this.productService.getAllProducts(query);

        return new ApiPagRes(result.products, result.total, page, perPage, SUCCESS);
    }

    @Get(':productId')
    @Roles(EUserRole.ADMIN)
    async getProductById(@Param('productId') productId: number) {
        const product = await this.productService.getProductById(productId);

        return new ApiRes(product, SUCCESS);
    }

    @Post()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateProductOutRes })
    async createProduct(
        @Body() createProductDto: CreateProductInDto,
    ) {
        const newProduct = await this.productService.createProduct(
            createProductDto,
        );

        return new ApiRes(newProduct, SUCCESS);
    }


    @Patch(':productId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: UpdateProductOutRes })
    async updateProduct(
        @Param('productId') productId: number,
        @Body() updateProductDto: UpdateProductInDto,
    ) {
        const updatedProduct = await this.productService.updateProduct(
            productId,
            updateProductDto,
        );

        return new ApiRes(updatedProduct, SUCCESS);
    }

    @Delete(':productId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteProductById(@Param('productId') productId: number) {
        await this.productService.deleteProductById(productId);

        return new ApiNullableRes(null, SUCCESS);
    }


    @Post('upload/single')
    @Roles(EUserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                image: {
                    type: 'string',
                    format: 'binary',
                },
            },
        },
    })
    @UseInterceptors(FileInterceptor('image'))
    async uploadProductImage(
        @UploadedFile() image: Express.Multer.File,
    ) {
        const uploadedImage = await this.productService.uploadProductImage(image);
        return new ApiRes(uploadedImage, SUCCESS);
    }

    @Post('upload/multiple')
    @Roles(EUserRole.ADMIN)
    @ApiConsumes('multipart/form-data')
    @ApiBody({
        schema: {
            type: 'object',
            properties: {
                images: {
                    type: 'array',
                    items: {
                        type: 'string',
                        format: 'binary',
                    },
                },
            },
        },
    })
    @UseInterceptors(FilesInterceptor('images'))
    async uploadProductImages(
        @UploadedFiles() images: Express.Multer.File[],
    ) {
        const uploadedImages = await this.productService.uploadProductImages(images);
        return new ApiRes(uploadedImages, SUCCESS);
    }
}
