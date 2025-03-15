import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Repository } from 'typeorm';
import { createBrandDto } from '../dto/create-brand.dto';
import { updateBrandDto } from '../dto/update-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getAllBrands() {
    const brands = await this.brandRepository.find({
      relations: [
        'products',
        'products.manufacturer',
        'products.category',
        'products.tags',
        'products.images',
      ],
    });

    if (!brands) {
      throw new NotFoundException('Brand Not Found');
    }
    return {
      data: brands,
    };
  }

  async getBrandById(brandId: number) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }

    return {
      data: brand,
    };
  }

  async createBrand(createBrandDto: createBrandDto) {
    const brand = this.brandRepository.create({
      ...createBrandDto,
    });

    await this.brandRepository.save(brand);
    return {
      success: true,
      message: 'Brand created successfully',
    };
  }

  async updateBrand(brandId: number, updateBrandDto: updateBrandDto) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    Object.assign(brand, updateBrandDto);

    await this.brandRepository.save(brand);

    return {
      success: true,
      message: 'Brand updated successfully',
    };
  }

  async deleteBrand(brandId: number) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.delete({ id: brandId });

    return { success: true, message: 'Brand deleted successfully' };
  }
}
