import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Repository } from 'typeorm';
@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async getAllBrands(): Promise<Brand[]> {
    const brands = await this.brandRepository.find();

    if (!brands) {
      throw new NotFoundException('Brand Not Found');
    }
    return brands;
  }
}
