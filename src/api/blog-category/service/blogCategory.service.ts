import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { BlogCategory } from 'src/database/entities/blog/blog-category.entity';
import { Repository } from 'typeorm';
import { GetAllBlogCategoriesInDto } from '../dto/get-all-blog-categories.in.dto';
import { GetAllBlogCategoriesOutDto } from '../dto/get-all-blog-categories.out.dto';
import { CreateBlogCategoryInDto } from '../dto/create-blog-category.in.dto';
import { CreateBlogCategoryOutDto } from '../dto/create-blog-category.out.dto';
import { UpdateBlogCategoryInDto } from '../dto/update-blog-category.in.dto';
import { UpdateBlogCategoryOutDto } from '../dto/update-blog-category.out.dto';

@Injectable()
export class BlogCategoryService {
    constructor(
        @InjectRepository(BlogCategory)
        private blogCategoryRepository: Repository<BlogCategory>,
    ) { }

    // customer
    async getNameOfAllBlogCategories(): Promise<string[]> {
        const categories = await this.blogCategoryRepository.find();

        if (!categories) {
            throw new NotFoundException('Category Not Found');
        }
        return categories.map((category) => category.name);
    }

    // admin
    async getAllBlogCategories(
        query: GetAllBlogCategoriesInDto,
    ): Promise<{ blogCategories: GetAllBlogCategoriesOutDto[]; total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
        const skip = (page - 1) * perPage;
        const take = perPage;

        const qb = this.blogCategoryRepository.createQueryBuilder('category')
            .leftJoin('category.blogs', 'blog')
            .select([
                'category.id',
                'category.name',
                'category.description',
                'category.slug',
                'category.created_at',
                'COUNT(blog.id) AS blog_count',
            ])
            .groupBy('category.id')
            .addGroupBy('category.name')
            .addGroupBy('category.created_at')
            .skip(skip)
            .take(take);

        if (search) {
            qb.andWhere('category.name LIKE :search', { search: `%${search}%` });
        }

        const [rawBlogCategories, total] = await Promise.all([
            qb.getRawMany(),

            // Count filtered categorys
            this.blogCategoryRepository.createQueryBuilder('category')
                .where(search ? 'category.name LIKE :search' : 'TRUE', search ? { search: `%${search}%` } : {})
                .getCount(),
        ]);

        const blogCategories: GetAllBlogCategoriesOutDto[] = rawBlogCategories.map(raw => ({
            id: raw.category_id,
            name: raw.category_name,
            description: raw.category_description,
            slug: raw.category_slug,
            created_at: raw.category_created_at,
            modified_at: raw.category_modified_at,
            blog_count: parseInt(raw.blog_count, 10),
        }));

        return { blogCategories, total };

    }

    async createBlogCategory(
        creatBlogCategoryDto: CreateBlogCategoryInDto,
    ): Promise<CreateBlogCategoryOutDto> {
        const newCategory = this.blogCategoryRepository.create(creatBlogCategoryDto);
        return this.blogCategoryRepository.save(newCategory);
    }

    async updateBlogCategory(
        blogCategoryId: number,
        updateBlogCategoryDto: UpdateBlogCategoryInDto,
    ): Promise<UpdateBlogCategoryOutDto> {
        const updatedCategory = await this.blogCategoryRepository.update(blogCategoryId, updateBlogCategoryDto);
        return updatedCategory.raw;
    }

    async deleteCategory(categoryId: number): Promise<void> {
        await this.blogCategoryRepository.delete(categoryId);
    }
}
