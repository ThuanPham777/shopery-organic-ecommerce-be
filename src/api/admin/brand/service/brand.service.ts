import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Repository } from 'typeorm';
import { createBrandDto } from '../dto/create-brand.dto';
import { updateBrandDto } from '../dto/update-brand.dto';
import { GetAllBrands } from '../dto/get-all-brands.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async getAllBrands(
    query: GetAllBrands,
  ): Promise<{ brands: Brand[]; total: number }> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const [brands, total] = await this.brandRepository.findAndCount({
      relations: [
        'products',
        'products.manufacturer',
        'products.category',
        'products.tags',
        'products.images',
      ],
      skip,
      take,
    });
    return { brands, total };
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

    const newBrand = await this.brandRepository.save(brand);
    return {
      data: newBrand,
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

    const updatedBrand = await this.brandRepository.save(brand);

    return {
      data: updatedBrand,
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
