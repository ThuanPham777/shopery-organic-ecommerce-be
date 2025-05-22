import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Repository } from 'typeorm';
import { createBrandInDto } from '../dto/create-brand.in.dto';
import { updateBrandDto } from '../dto/update-brand.in.dto';
import { GetAllBrandsInDto } from '../dto/get-all-brands.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async getAllBrands(
    query: GetAllBrandsInDto,
  ): Promise<{ brands: Brand[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
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

  async getBrandById(brandId: number): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand Not Found');
    }

    return brand;
  }

  async createBrand(createBrandDto: createBrandInDto): Promise<Brand> {
    const brand = this.brandRepository.create({
      ...createBrandDto,
    });

    const newBrand = await this.brandRepository.save(brand);

    return newBrand;
  }

  async updateBrand(
    brandId: number,
    updateBrandDto: updateBrandDto,
  ): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    Object.assign(brand, updateBrandDto);

    const updatedBrand = await this.brandRepository.save(brand);

    return updatedBrand;
  }

  async deleteBrand(brandId: number) {
    const brand = await this.brandRepository.findOne({
      where: { id: brandId },
    });

    if (!brand) {
      throw new NotFoundException('Brand not found');
    }

    await this.brandRepository.delete({ id: brandId });
  }
}
