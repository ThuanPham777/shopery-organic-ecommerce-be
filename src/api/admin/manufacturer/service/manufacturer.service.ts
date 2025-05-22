import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Repository } from 'typeorm';
import { CreateManufacturerInDto } from '../dto/create-manufacturer.in.dto';
import { UpdateManufacturerInDto } from '../dto/update-manufacturer.in.dto';
import { GetAllManufacturersInDto } from '../dto/get-all-manufacturers.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) { }

  async getAllManufacturers(
    query: GetAllManufacturersInDto,
  ): Promise<{ manufacturers: Manufacturer[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
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

  async getManufacturerById(manufacturerId: number): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer Not Found');
    }

    return manufacturer;
  }

  async createManufacturer(
    createManufacturerDto: CreateManufacturerInDto,
  ): Promise<Manufacturer> {
    const manufacturer = this.manufacturerRepository.create({
      ...createManufacturerDto,
    });

    const newManufacturer =
      await this.manufacturerRepository.save(manufacturer);
    return newManufacturer;
  }

  async updateManufacturer(
    manufacturerId: number,
    updateManufacturerDto: UpdateManufacturerInDto,
  ): Promise<Manufacturer> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    Object.assign(manufacturer, updateManufacturerDto);

    const updatedManufacturer =
      await this.manufacturerRepository.save(manufacturer);

    return updatedManufacturer;
  }

  async deleteManufacturer(manufacturerId: number): Promise<Boolean> {
    const manufacturer = await this.manufacturerRepository.findOne({
      where: { id: manufacturerId },
    });

    if (!manufacturer) {
      throw new NotFoundException('Manufacturer not found');
    }

    await this.manufacturerRepository.delete({ id: manufacturerId });

    return true;
  }
}
