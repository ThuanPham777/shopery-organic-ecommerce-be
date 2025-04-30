import { updateCategoryDto } from '../dto/update-category.dto';
import { createCategoryDto } from '../dto/create-category.dto';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/database/entities/category/category.entity';
import { Repository } from 'typeorm';
import {
  deleteFromCloudinary,
  extractPublicId,
  uploadToCloudinary,
} from 'src/common/helper/cloudinary.helper';
import { GetAllCategories } from '../dto/get-all-categories.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}
  static folder = 'shopery-organic/category';

  async getAllCategories(
    query: GetAllCategories,
  ): Promise<{ categories: Category[]; total: number }> {
    const { page = 1, perPage = 10 } = query;
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

  async getCategoryById(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      // throw error
      throw new NotFoundException('Category Not Found');
    }

    return {
      data: category,
    };
  }

  async createCategory(
    createCategoryDto: createCategoryDto,
    image: Express.Multer.File,
  ) {
    if (!image) {
      throw new BadRequestException('image file is required');
    }

    // Upload image lên Cloudinary
    const uploadResult: any = await uploadToCloudinary(
      image,
      CategoryService.folder,
    );
    createCategoryDto.image = uploadResult.secure_url;

    const category = this.categoryRepository.create({
      ...createCategoryDto,
    });

    const newCategory = await this.categoryRepository.save(category);
    return {
      data: newCategory,
      success: true,
      message: 'category created successfully',
    };
  }

  async updateCategory(
    categoryId: number,
    updateCategoryDto: updateCategoryDto,
    image?: Express.Multer.File,
  ) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (image) {
      try {
        if (category.image) {
          const publicId = extractPublicId(category.image);
          await deleteFromCloudinary(publicId);
        }

        const uploadResult = await uploadToCloudinary(
          image,
          CategoryService.folder,
        );
        category.image = uploadResult.secure_url;
      } catch (error) {
        throw new InternalServerErrorException('Image upload failed');
      }
    }

    Object.assign(category, updateCategoryDto);

    const updatedCategory = await this.categoryRepository.save(category);

    return {
      data: updatedCategory,
      success: true,
      message: 'Category updated successfully',
    };
  }

  async deleteCategory(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException('Product not found');
    }

    // Nếu sản phẩm có ảnh image, xóa trên Cloudinary trước
    if (category.image) {
      const publicId = extractPublicId(category.image);
      await deleteFromCloudinary(publicId);
    }

    // Xóa sản phẩm khỏi database
    await this.categoryRepository.delete({ id: categoryId });

    return { success: true, message: 'Product deleted successfully' };
  }
}
