import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Manufacturer } from 'src/database/entities/manufacturer/manufacturer.entity';
import { Repository } from 'typeorm';
import { UpdateManufacturerInDto } from '../dto/update-manufacturer.in.dto';
import { CreateManufacturerInDto } from '../dto/create-manufacturer.in.dto';
import { GetAllManufacturersInDto } from '../dto/get-all-manufacturers.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { GetAllManufacturersOutDto } from '../dto/get-all-manufacturer.out.dto';
import { CreateManufacturerOutDto } from '../dto/create-manufacturer.out.dto';
import { UpdateManufacturerOutDto } from '../dto/update-manufacturer.out.dto';

@Injectable()
export class ManufacturerService {
  constructor(
    @InjectRepository(Manufacturer)
    private manufacturerRepository: Repository<Manufacturer>,
  ) { }

  async getNameOfAllManufacturers(): Promise<string[]> {
    const manufacturers = await this.manufacturerRepository.find();

    if (!manufacturers) {
      throw new NotFoundException('Manufacturer Not Found');
    }
    return manufacturers.map((manufacturer) => manufacturer.name);
  }


  async getAllManufacturers(
    query: GetAllManufacturersInDto,
  ): Promise<{ manufacturers: GetAllManufacturersOutDto[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;
    const qb = this.manufacturerRepository.createQueryBuilder('manufacturer')
      .leftJoin('manufacturer.products', 'product')
      .select([
        'manufacturer.id',
        'manufacturer.name',
        'manufacturer.created_at',
        'COUNT(product.id) AS product_count',
      ])
      .groupBy('manufacturer.id')
      .addGroupBy('manufacturer.name')
      .addGroupBy('manufacturer.created_at')
      .skip(skip)
      .take(take);

    if (search) {
      qb.andWhere('manufacturer.name LIKE :search', { search: `%${search}%` });
    }

    const [rawManufacturers, total] = await Promise.all([
      qb.getRawMany(),

      // Count filtered manufacturers
      this.manufacturerRepository.createQueryBuilder('manufacturer')
        .where(search ? 'manufacturer.name LIKE :search' : 'TRUE', search ? { search: `%${search}%` } : {})
        .getCount(),
    ]);

    const manufacturers: GetAllManufacturersOutDto[] = rawManufacturers.map(raw => ({
      id: raw.manufacturer_id,
      name: raw.manufacturer_name,
      created_at: raw.manufacturer_created_at,
      product_count: parseInt(raw.product_count, 10),
    }));

    return { manufacturers, total };
  }

  async createManufacturer(
    createManufacturerDto: CreateManufacturerInDto,
  ): Promise<CreateManufacturerOutDto> {
    const newManufacturer = this.manufacturerRepository.create(createManufacturerDto);
    return this.manufacturerRepository.save(newManufacturer);
  }

  async updateManufacturer(
    manufacturerId: number,
    updateManufacturerDto: UpdateManufacturerInDto,
  ): Promise<UpdateManufacturerOutDto> {
    const updatedManufacturer = await this.manufacturerRepository.update(manufacturerId, updateManufacturerDto);
    return updatedManufacturer.raw;
  }

  async deleteManufacturer(manufacturerId: number): Promise<void> {
    await this.manufacturerRepository.delete(manufacturerId);
  }
}
