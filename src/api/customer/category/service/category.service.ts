import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { Repository } from 'typeorm';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) { }

  async getAllCategories(): Promise<Category[]> {
    const categories = await this.categoryRepository.find();

    if (!categories) {
      throw new NotFoundException('Category Not Found');
    }
    return categories;
  }
}
