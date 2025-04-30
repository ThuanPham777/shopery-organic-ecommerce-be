import { Controller, Get } from '@nestjs/common';
import { BrandService } from '../service/brand.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  async getAllBrands() {
    return this.brandService.getAllBrands();
  }
}
