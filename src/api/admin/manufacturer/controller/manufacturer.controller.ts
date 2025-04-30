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
import { updateManufacturerDto } from '../dto/update-manufacturer.dto';
import { createManufacturerDto } from '../dto/create-manufacturer.dto';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Admin / Manufacturer')
@Controller('admin/manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllManufacturers() {
    return this.manufacturerService.getAllManufacturers();
  }

  @Get(':manufacturerId')
  @UseGuards(JwtAuthGuard)
  async getManufacturerById(@Param('manufacturerId') manufacturerId: number) {
    return this.manufacturerService.getManufacturerById(manufacturerId);
  }

  @Post('create')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async createManufacturer(
    @Body() createManufacturerDto: createManufacturerDto,
  ) {
    return this.manufacturerService.createManufacturer(createManufacturerDto);
  }

  @Patch(':manufacturerId/update')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateManufacturer(
    @Param('manufacturerId') manufacturerId: number,
    @Body() updateManufacturerDto: updateManufacturerDto,
  ) {
    return this.manufacturerService.updateManufacturer(
      manufacturerId,
      updateManufacturerDto,
    );
  }

  @Delete(':manufacturerId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteManufacturer(@Param('manufacturerId') manufacturerId: number) {
    return this.manufacturerService.deleteManufacturer(manufacturerId);
  }
}
