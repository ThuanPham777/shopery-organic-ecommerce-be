import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Repository } from 'typeorm';
import { createManufacturerDto } from '../dto/create-manufacturer.dto';
import { updateManufacturerDto } from '../dto/update-manufacturer.dto';
import { GetAllManufacturers } from '../dto/get-all-manufacturers.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) {}

  async getAllManufacturers(
    query: GetAllManufacturers,
  ): Promise<{ manufacturers: Manufacturer[]; total: number }> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;
    const [manufacturers, total] =
      await this.manufacturerRepository.findAndCount({
        relations: [
          'products',
          'products.brand',
          'products.category',
          'products.tags',
          'products.images',
        ],
        skip,
        take,
      });

    return {
      manufacturers,
      total,
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

    const newManufacturer =
      await this.manufacturerRepository.save(manufacturer);
    return {
      data: newManufacturer,
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

    const updatedManufacturer =
      await this.manufacturerRepository.save(manufacturer);

    return {
      data: updatedManufacturer,
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
