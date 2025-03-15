import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateManufacturerDto } from '../dto/update-manufacturer.dto';
import { createManufacturerDto } from '../dto/create-manufacturer.dto';
import { ManufacturerService } from '../service/manufacturer.service';

@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  async getAllManufacturers() {
    return this.manufacturerService.getAllManufacturers();
  }

  @Get(':manufacturerId')
  async getManufacturerById(@Param('manufacturerId') manufacturerId: number) {
    return this.manufacturerService.getManufacturerById(manufacturerId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createManufacturer(
    @Body() createManufacturerDto: createManufacturerDto,
  ) {
    return this.manufacturerService.createManufacturer(createManufacturerDto);
  }

  @Patch(':manufacturerId/update')
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
  async deleteManufacturer(@Param('manufacturerId') manufacturerId: number) {
    return this.manufacturerService.deleteManufacturer(manufacturerId);
  }
}
