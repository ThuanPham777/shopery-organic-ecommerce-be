import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateBrandDto } from '../dto/update-brand.dto';
import { createBrandDto } from '../dto/create-brand.dto';
import { BrandService } from '../service/brand.service';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @Get(':brandId')
  async getBrandById(@Param('brandId') brandId: number) {
    return this.brandService.getBrandById(brandId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBrand(@Body() createBrandDto: createBrandDto) {
    return this.brandService.createBrand(createBrandDto);
  }

  @Patch(':brandId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateBrand(
    @Param('brandId') brandId: number,
    @Body() updateBrandDto: updateBrandDto,
  ) {
    return this.brandService.updateBrand(brandId, updateBrandDto);
  }

  @Delete(':brandId/delete')
  async deleteBrand(@Param('brandId') brandId: number) {
    return this.brandService.deleteBrand(brandId);
  }
}
