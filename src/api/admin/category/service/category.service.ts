import { UpdateCategoryInDto } from '../dto/update-category.in.dto';
import { CreateCategoryInDto } from '../dto/create-category.in.dto';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { Repository } from 'typeorm';
import { GetAllCategoriesInDto } from '../dto/get-all-categories.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { UploadService } from 'src/common/helper/upload/upload.service';
@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    private readonly uploadService: UploadService,
  ) { }
  static folder = 'shopery-organic/category';

  async getAllCategories(
    query: GetAllCategoriesInDto,
  ): Promise<{ categories: Category[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;
    const [categories, total] = await this.categoryRepository.findAndCount({
      relations: [
        'products',
        'products.brand',
        'products.manufacturer',
        'products.tags',
        'products.images',
      ],
      skip,
      take,
    });

    return {
      categories,
      total,
    };
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      // throw error
      throw new NotFoundException('Category Not Found');
    }

    return category;
  }

  async createCategory(
    createCategoryDto: CreateCategoryInDto,
  ): Promise<Category> {

    const category = this.categoryRepository.create({
      ...createCategoryDto,
    });

    const newCategory = await this.categoryRepository.save(category);
    return newCategory;
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: UpdateCategoryInDto,
  ): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    Object.assign(category, updateCategoryDto);

    const updatedCategory = await this.categoryRepository.save(category);

    return updatedCategory;
  }

  async deleteCategory(categoryId: number): Promise<boolean> {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Product not found');
    }

    // Xóa sản phẩm khỏi database
    await this.categoryRepository.delete({ id: categoryId });

    return true;
  }

  async uploadCategoryImage(image: Express.Multer.File): Promise<string> {
    const uploadResult = await this.uploadService.uploadToCloudinary(
      image,
      CategoryService.folder,
    );
    return uploadResult.secure_url;
  }
}
