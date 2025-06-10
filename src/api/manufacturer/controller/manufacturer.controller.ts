import { Controller, Get } from '@nestjs/common';
import { ManufacturerService } from '../service/manufacturer.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('manufacturer')
@Controller('manufacturer')
export class ManufacturerController {
  constructor(private readonly manufacturerService: ManufacturerService) { }

  @Get()
  async getNameOfAllManufacturers() {
    const manufacturersName = await this.manufacturerService.getNameOfAllManufacturers();

    return new ApiRes(manufacturersName, SUCCESS);
  }
}
