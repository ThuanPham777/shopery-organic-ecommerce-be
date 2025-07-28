import { CategoryAttribute } from '../../../database/entities/category/category-attribute.entity';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { Category } from 'src/database/entities/category/category.entity';
import { In, IsNull, Repository } from 'typeorm';
import { GetAllCategoriesInDto } from '../dto/get-all-categories.in.dto';
import { CreateCategoryInDto } from '../dto/create-category.in.dto';
import { UpdateCategoryInDto } from '../dto/update-category.in.dto';
import { GetAllCategoriesOutDto } from '../dto/get-all-categories.out.dto';
import { Attribute } from 'src/database/entities/attribute/attribute.entity';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,

    @InjectRepository(CategoryAttribute)
    private readonly categoryAttributeRepository: Repository<CategoryAttribute>,

    @InjectRepository(Attribute)
    private readonly attributeRepository: Repository<Attribute>,
  ) {}

  // customer
  async getNameOfAllCategories(): Promise<
    { name: string; subCategory: string[] }[]
  > {
    const categories = await this.categoryRepository.find({
      where: { parent: IsNull() },
      relations: ['children'],
    });

    if (!categories || categories.length === 0) {
      throw new NotFoundException('Category Not Found');
    }

    const result = categories.map((category) => ({
      name: category.name,
      subCategory: category.children?.map((child) => child.name) || [],
    }));

    return result;
  }

  // admin
  async findAll(
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
      modified_at: raw.category_modified_at,
      deleted_at: raw.category_deleted_at,
      product_count: parseInt(raw.product_count, 10),
    }));

    return { categories, total };
  }

  async create(dto: CreateCategoryInDto): Promise<Category> {
    const { attributeIds, subCategoryIds, ...categoryData } = dto;
    // 1. Tạo category cha
    const parentCategory = this.categoryRepository.create(categoryData);
    await this.categoryRepository.save(parentCategory);

    // 2. Gán attribute nếu có
    if (attributeIds?.length) {
      // lấy ra các attribute
      const attributes = await this.attributeRepository.findBy({
        id: In(attributeIds),
      });

      if (attributes.length !== attributeIds.length) {
        throw new BadRequestException('Some attributes not found');
      }

      const categoryAttributes = attributes.map((attribute) =>
        this.categoryAttributeRepository.create({
          category: parentCategory,
          attribute,
        }),
      );
      await this.categoryAttributeRepository.save(categoryAttributes);
    }

    // 3. Gán subcategories nếu có
    if (subCategoryIds?.length) {
      const subCategories = await this.categoryRepository.findBy({
        id: In(subCategoryIds),
      });

      if (subCategories.length !== subCategoryIds.length) {
        throw new BadRequestException('Some subcategories not found');
      }

      for (const sub of subCategories) {
        sub.parent = parentCategory;
      }
      await this.categoryRepository.save(subCategories);
    }

    return parentCategory;
  }

  async update(
    categoryId: number,
    dto: UpdateCategoryInDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ['children'],
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const { subCategoryIds, attributeIds, ...rest } = dto;

    // Cập nhật fields cơ bản
    Object.assign(category, rest);
    await this.categoryRepository.save(category);

    // Cập nhật lại các subcategories nếu có
    if (subCategoryIds) {
      // Đầu tiên: loại bỏ quan hệ cũ (gỡ quan hệ parent khỏi các con cũ)
      const oldChildren = category.children || [];
      for (const oldChild of oldChildren) {
        oldChild.parent = null;
      }
      await this.categoryRepository.save(oldChildren);

      // Sau đó: gán parent cho các category mới
      const newChildren = await this.categoryRepository.findBy({
        id: In(subCategoryIds),
      });

      if (newChildren.length !== subCategoryIds.length) {
        throw new BadRequestException('Some subcategories not found');
      }

      for (const child of newChildren) {
        child.parent = category;
      }
      await this.categoryRepository.save(newChildren);
    }

    // Cập nhật lại các attributes nếu có
    if (attributeIds) {
      // Xoá các attribute cũ
      await this.categoryAttributeRepository.delete({
        category: { id: categoryId },
      });

      const attributes = await this.attributeRepository.findBy({
        id: In(attributeIds),
      });

      const categoryAttributes = attributes.map((attribute) =>
        this.categoryAttributeRepository.create({
          category,
          attribute,
        }),
      );
      await this.categoryAttributeRepository.save(categoryAttributes);
    }

    return category;
  }

  async delete(categoryId: number): Promise<void> {
    await this.categoryRepository.softDelete(categoryId);
  }
}
