import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Category } from 'src/database/entities/category/category.entity';
import { Repository } from 'typeorm';
import { GetAllCategoriesInDto } from '../dto/get-all-categories.in.dto';
import { CreateCategoryInDto } from '../dto/create-category.in.dto';
import { UpdateCategoryInDto } from '../dto/update-category.in.dto';
import { GetAllCategoriesOutDto } from '../dto/get-all-categories.out.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  // customer
  async getNameOfAllCategories(): Promise<string[]> {
    const categories = await this.categoryRepository.find();

    if (!categories) {
      throw new NotFoundException('Category Not Found');
    }
    return categories.map((category) => category.name);
  }

  // admin
  async getAllCategories(
    query: GetAllCategoriesInDto,
  ): Promise<{ categories: GetAllCategoriesOutDto[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const qb = this.categoryRepository
      .createQueryBuilder('category')
      .leftJoin('category.products', 'product')
      .select([
        'category.id',
        'category.name',
        'category.description',
        'category.slug',
        'category.image',
        'category.created_at',
        'COUNT(product.id) AS product_count',
      ])
      .groupBy('category.id')
      .addGroupBy('category.name')
      .addGroupBy('category.created_at')
      .skip(skip)
      .take(take);

    if (search) {
      qb.andWhere('category.name LIKE :search', { search: `%${search}%` });
    }

    const [rawCategories, total] = await Promise.all([
      qb.getRawMany(),

      // Count filtered categorys
      this.categoryRepository
        .createQueryBuilder('category')
        .where(
          search ? 'category.name LIKE :search' : 'TRUE',
          search ? { search: `%${search}%` } : {},
        )
        .getCount(),
    ]);

    const categories: GetAllCategoriesOutDto[] = rawCategories.map((raw) => ({
      id: raw.category_id,
      name: raw.category_name,
      description: raw.category_description,
      slug: raw.category_slug,
      image: raw.category_image,
      created_at: raw.category_created_at,
      product_count: parseInt(raw.product_count, 10),
    }));

    return { categories, total };
  }

  async createCategory(
    createCategoryDto: CreateCategoryInDto,
  ): Promise<Category> {
    const category = this.categoryRepository.create(createCategoryDto);

    if (createCategoryDto.parentId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) throw new NotFoundException('Parent category not found');
      category.parent = parent;
    }

    return this.categoryRepository.save(category);
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryInDto,
  ): Promise<Category> {
    const updatedCategory = await this.categoryRepository.update(
      categoryId,
      updateCategoryDto,
    );
    return updatedCategory.raw;
  }

  async deleteCategory(categoryId: number): Promise<void> {
    await this.categoryRepository.delete(categoryId);
  }
}
