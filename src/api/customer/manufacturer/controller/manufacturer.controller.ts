import { Controller, Get } from '@nestjs/common';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) { }

  @Get()
  async getAllManufacturers() {
    const manufacturers = await this.manufacturerService.getAllManufacturers();

    return new ApiRes(manufacturers, 'Get all manufacturers successfully');
  }
}
