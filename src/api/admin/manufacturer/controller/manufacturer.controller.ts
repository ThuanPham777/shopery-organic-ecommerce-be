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
import { UpdateManufacturerInDto } from '../dto/update-manufacturer.in.dto';
import { CreateManufacturerInDto } from '../dto/create-manufacturer.in.dto';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllManufacturersInDto } from '../dto/get-all-manufacturers.in.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllManufacturersOutRes } from '../dto/get-all-manufacturer.out.dto';
import { CreateManufacturerOutRes } from '../dto/create-manufacturer.out.dto';
import { UpdateManufacturerOutRes } from '../dto/update-manufacturer.out.dto';
import { EUserRole } from 'src/enums/user.enums';

@ApiTags('Admin / Manufacturer')
@Controller('admin/manufacturer')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) { }

  @Get()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: GetAllManufacturersOutRes })
  async getAllManufacturers(@Query() query: GetAllManufacturersInDto) {
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
  @Roles(EUserRole.ADMIN)
  async getManufacturerById(@Param('manufacturerId') manufacturerId: number) {
    const manufacturer =
      await this.manufacturerService.getManufacturerById(manufacturerId);

    return new ApiRes(manufacturer, SUCCESS);
  }

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: CreateManufacturerOutRes })
  async createManufacturer(
    @Body() createManufacturerDto: CreateManufacturerInDto,
  ) {
    const newManufacturer = await this.manufacturerService.createManufacturer(
      createManufacturerDto,
    );

    return new ApiRes(newManufacturer, SUCCESS);
  }

  @Patch(':manufacturerId')
  @UsePipes(new ValidationPipe({ transform: true }))
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: UpdateManufacturerOutRes })
  async updateManufacturer(
    @Param('manufacturerId') manufacturerId: number,
    @Body() updateManufacturerDto: UpdateManufacturerInDto,
  ) {
    const updatedManufacturer =
      await this.manufacturerService.updateManufacturer(
        manufacturerId,
        updateManufacturerDto,
      );

    return new ApiRes(updatedManufacturer, SUCCESS);
  }

  @Delete(':manufacturerId')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: ApiNullableRes })
  async deleteManufacturer(@Param('manufacturerId') manufacturerId: number) {
    await this.manufacturerService.deleteManufacturer(manufacturerId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
