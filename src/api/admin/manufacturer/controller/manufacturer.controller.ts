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
import { updateManufacturerDto } from '../dto/update-manufacturer.dto';
import { createManufacturerDto } from '../dto/create-manufacturer.dto';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllManufacturers } from '../dto/get-all-manufacturers.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Admin / Manufacturer')
@Controller('admin/manufacturer')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @Roles('admin')
  async getAllManufacturers(@Query() query: GetAllManufacturers) {
    const { page, perPage } = query;
    const result = await this.manufacturerService.getAllManufacturers(query);

    return new ApiPagRes(
      result.manufacturers,
      result.total,
      page,
      perPage,
      SUCCESS,
    );
  }

  @Get(':manufacturerId')
  @Roles('admin')
  async getManufacturerById(@Param('manufacturerId') manufacturerId: number) {
    const manufacturer =
      await this.manufacturerService.getManufacturerById(manufacturerId);

    return new ApiRes(manufacturer, SUCCESS);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles('admin')
  async createManufacturer(
    @Body() createManufacturerDto: createManufacturerDto,
  ) {
    const newManufacturer = await this.manufacturerService.createManufacturer(
      createManufacturerDto,
    );

    return new ApiRes(newManufacturer, SUCCESS);
  }

  @Patch(':manufacturerId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles('admin')
  async updateManufacturer(
    @Param('manufacturerId') manufacturerId: number,
    @Body() updateManufacturerDto: updateManufacturerDto,
  ) {
    const updatedManufacturer =
      await this.manufacturerService.updateManufacturer(
        manufacturerId,
        updateManufacturerDto,
      );

    return new ApiRes(updatedManufacturer, SUCCESS);
  }

  @Delete(':manufacturerId/delete')
  @Roles('admin')
  async deleteManufacturer(@Param('manufacturerId') manufacturerId: number) {
    await this.manufacturerService.deleteManufacturer(manufacturerId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
