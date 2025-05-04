import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateBrandDto } from '../dto/update-brand.dto';
import { createBrandDto } from '../dto/create-brand.dto';
import { BrandService } from '../service/brand.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllBrandsDto } from '../dto/get-all-brands.dto';

@ApiTags('Admin / Brand')
@Controller('admin/brand')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @Roles('admin')
  async getAllBrands(@Query() query: GetAllBrandsDto) {
    const { page, perPage } = query;
    const result = await this.brandService.getAllBrands(query);

    return new ApiPagRes(result.brands, result.total, page, perPage, SUCCESS);
  }
  @Get(':brandId')
  async getBrandById(@Param('brandId') brandId: number) {
    const brand = await this.brandService.getBrandById(brandId);

    return new ApiRes(brand, SUCCESS);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createBrand(@Body() createBrandDto: createBrandDto) {
    const newBrand = await this.brandService.createBrand(createBrandDto);

    return new ApiRes(newBrand, SUCCESS);
  }

  @Patch(':brandId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateBrand(
    @Param('brandId') brandId: number,
    @Body() updateBrandDto: updateBrandDto,
  ) {
    const updatedBrand = await this.brandService.updateBrand(
      brandId,
      updateBrandDto,
    );

    return new ApiRes(updatedBrand, SUCCESS);
  }

  @Delete(':brandId/delete')
  async deleteBrand(@Param('brandId') brandId: number) {
    await this.brandService.deleteBrand(brandId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
