import { Controller, Get } from '@nestjs/common';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  async getAllManufacturers() {
    return this.manufacturerService.getAllManufacturers();
  }
}
