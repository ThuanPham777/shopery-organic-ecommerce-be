import { Controller, Get } from '@nestjs/common';
import { BrandService } from '../service/brand.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Get()
  async getAllBrands() {
    const brands = await this.brandService.getAllBrands();

    return new ApiRes(brands, 'Get all brands successfully');
  }
}
