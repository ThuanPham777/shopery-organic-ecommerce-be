import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) { }

  async getAllManufacturers(): Promise<Manufacturer[]> {
    const manufacturers = await this.manufacturerRepository.find();

    if (!manufacturers) {
      throw new NotFoundException('Manufacturer Not Found');
    }
    return manufacturers;
  }
}
