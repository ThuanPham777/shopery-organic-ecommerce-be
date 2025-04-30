import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateBrandDto } from '../dto/update-brand.dto';
import { createBrandDto } from '../dto/create-brand.dto';
import { BrandService } from '../service/brand.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Admin / Brand')
@Controller('admin/brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBrands() {
    return this.brandService.getAllBrands();
  }

  @Get(':brandId')
  @UseGuards(JwtAuthGuard)
  async getBrandById(@Param('brandId') brandId: number) {
    return this.brandService.getBrandById(brandId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBrand(@Body() createBrandDto: createBrandDto) {
    return this.brandService.createBrand(createBrandDto);
  }

  @Patch(':brandId/update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateBrand(
    @Param('brandId') brandId: number,
    @Body() updateBrandDto: updateBrandDto,
  ) {
    return this.brandService.updateBrand(brandId, updateBrandDto);
  }

  @Delete(':brandId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteBrand(@Param('brandId') brandId: number) {
    return this.brandService.deleteBrand(brandId);
  }
}
