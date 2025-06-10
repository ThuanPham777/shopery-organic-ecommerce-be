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
import { updateBrandDto } from '../dto/update-brand.in.dto';
import { createBrandInDto } from '../dto/create-brand.in.dto';
import { BrandService } from '../service/brand.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import {
    ApiNullableRes,
    ApiPagRes,
    ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { EUserRole } from 'src/enums/user.enums';
import { GetAllBrandsOutRes } from '../dto/get-all-brands.out.dto';
import { GetAllBrandsInDto } from '../dto/get-all-brands.in.dto';
import { CreateBrandOutRes } from '../dto/create-brand.out.dto';
import { UpdateBrandOutRes } from '../dto/update-brand.out.dto';

@ApiTags('Admin / Brand')
@Controller('admin/brand')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class BrandAdminController {
    constructor(private readonly brandService: BrandService) { }

    @Get()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: GetAllBrandsOutRes })
    async getAllBrands(@Query() query: GetAllBrandsInDto) {
        const { page, perPage } = query;
        const result = await this.brandService.getAllBrands(query);

        return new ApiPagRes(result.brands, result.total, page, perPage, SUCCESS);
    }

    @Post()
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: CreateBrandOutRes })
    @UsePipes(new ValidationPipe({ transform: true }))
    async createBrand(@Body() createBrandInDto: createBrandInDto) {
        const newBrand = await this.brandService.createBrand(createBrandInDto);

        return new ApiRes(newBrand, SUCCESS);
    }

    @Patch(':brandId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: UpdateBrandOutRes })
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

    @Delete(':brandId')
    @Roles(EUserRole.ADMIN)
    @ApiOkResponse({ type: ApiNullableRes })
    async deleteBrand(@Param('brandId') brandId: number) {
        await this.brandService.deleteBrand(brandId);

        return new ApiNullableRes(null, SUCCESS);
    }
}
