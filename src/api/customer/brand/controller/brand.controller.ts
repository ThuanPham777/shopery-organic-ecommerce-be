import { Controller, Get, UseGuards } from '@nestjs/common';
import { BrandService } from '../service/brand.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllBrands() {
    return this.brandService.getAllBrands();
  }
}
