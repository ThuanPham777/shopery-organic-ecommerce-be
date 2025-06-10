import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Brand } from 'src/database/entities/brand/brand.entity';
import { Repository } from 'typeorm';
import { GetAllBrandsInDto } from '../dto/get-all-brands.in.dto';
import { createBrandInDto } from '../dto/create-brand.in.dto';
import { updateBrandDto } from '../dto/update-brand.in.dto';
import { GetAllBrandsOutDto } from '../dto/get-all-brands.out.dto';
import { CreateBrandOutDto, CreateBrandOutRes } from '../dto/create-brand.out.dto';
import { UpdateBrandOutDto } from '../dto/update-brand.out.dto';
@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) { }

  async getNameOfAllBrands(): Promise<string[]> {
    const brands = await this.brandRepository.find();

    if (!brands) {
      throw new NotFoundException('Brand Not Found');
    }
    return brands.map((brand) => brand.name);
  }

  async getAllBrands(query: GetAllBrandsInDto): Promise<{ brands: GetAllBrandsOutDto[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const qb = this.brandRepository.createQueryBuilder('brand')
      .leftJoin('brand.products', 'product')
      .select([
        'brand.id',
        'brand.name',
        'brand.created_at',
        'COUNT(product.id) AS product_count',
      ])
      .groupBy('brand.id')
      .addGroupBy('brand.name')
      .addGroupBy('brand.created_at')
      .skip(skip)
      .take(take);

    if (search) {
      qb.andWhere('brand.name LIKE :search', { search: `%${search}%` });
    }

    const [rawBrands, total] = await Promise.all([
      qb.getRawMany(),

      // Count filtered brands
      this.brandRepository.createQueryBuilder('brand')
        .where(search ? 'brand.name LIKE :search' : 'TRUE', search ? { search: `%${search}%` } : {})
        .getCount(),
    ]);

    const brands: GetAllBrandsOutDto[] = rawBrands.map(raw => ({
      id: raw.brand_id,
      name: raw.brand_name,
      created_at: raw.brand_created_at,
      product_count: parseInt(raw.product_count, 10),
    }));

    return { brands, total };
  }

  async createBrand(brand: createBrandInDto): Promise<CreateBrandOutDto> {
    const newBrand = this.brandRepository.create(brand);
    return this.brandRepository.save(newBrand);
  }

  async updateBrand(
    brandId: number,
    updateBrandDto: updateBrandDto,
  ): Promise<UpdateBrandOutDto> {
    const brand = await this.brandRepository.update(brandId, updateBrandDto);
    return brand.raw;
  }

  async deleteBrand(brandId: number) {
    await this.brandRepository.delete(brandId);
  }
}
