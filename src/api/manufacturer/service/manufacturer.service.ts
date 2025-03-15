import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Repository } from 'typeorm';
import { createManufacturerDto } from '../dto/create-manufacturer.dto';
import { updateManufacturerDto } from '../dto/update-manufacturer.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async getAllManufacturers() {
    const manufacturers = await this.manufacturerRepository.find({
      relations: [
        'products',
        'products.brand',
        'products.category',
        'products.tags',
        'products.images',
      ],
    });

    if (!manufacturers) {
      throw new NotFoundException('Manufacturer Not Found');
    }
    return {
      data: manufacturers,
    };
  }

  async getManufacturerById(manufacturerId: number) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer Not Found');
    }

    return {
      data: manufacturer,
    };
  }

  async createManufacturer(createManufacturerDto: createManufacturerDto) {
    const manufacturer = this.manufacturerRepository.create({
      ...createManufacturerDto,
    });

    await this.manufacturerRepository.save(manufacturer);
    return {
      success: true,
      message: 'Manufacturer created successfully',
    };
  }

  async updateManufacturer(
    manufacturerId: number,
    updateManufacturerDto: updateManufacturerDto,
  ) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    Object.assign(manufacturer, updateManufacturerDto);

    await this.manufacturerRepository.save(manufacturer);

    return {
      success: true,
      message: 'Manufacturer updated successfully',
    };
  }

  async deleteManufacturer(manufacturerId: number) {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    await this.manufacturerRepository.delete({ id: manufacturerId });

    return { success: true, message: 'Manufacturer deleted successfully' };
  }
}
