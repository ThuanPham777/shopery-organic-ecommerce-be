import { Controller, Get, UseGuards } from '@nestjs/common';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllManufacturers() {
    return this.manufacturerService.getAllManufacturers();
  }
}
