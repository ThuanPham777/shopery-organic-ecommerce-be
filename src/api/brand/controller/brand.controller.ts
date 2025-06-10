import { Controller, Get } from '@nestjs/common';
import { BrandService } from '../service/brand.service';
import { ApiBearerAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('brand')
@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  @Get()
  @ApiOperation({ summary: 'Get all brands name' })
  @ApiOkResponse()
  async getNameOfAllBrands() {
    const brandsName = await this.brandService.getNameOfAllBrands();

    return new ApiRes(brandsName, SUCCESS);
  }
}
