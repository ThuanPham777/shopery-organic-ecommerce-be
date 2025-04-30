import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  static folder = 'shopery-organic/category';

  async getAllCategories() {
    const categories = await this.categoryRepository.find({
      relations: [
        'products',
        'products.brand',
        'products.manufacturer',
        'products.tags',
        'products.images',
      ],
    });

    if (!categories) {
      // throw error
      throw new NotFoundException('Category Not Found');
    }
    return {
      data: categories,
    };
  }
}
