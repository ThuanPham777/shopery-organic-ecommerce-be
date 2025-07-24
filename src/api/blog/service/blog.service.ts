import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Blog } from 'src/database/entities/blog/blog.entity';
import { In, Repository } from 'typeorm';
import { CreateBlogInDto } from '../dto/create-blog.in.dto';
import { BlogCategory } from 'src/database/entities/blog/blog-category.entity';
import { BlogTag } from 'src/database/entities/blog/blog-tags.entity';
import { UpdateBlogInDto } from '../dto/update-blog.in.dto';
import { GetAllBlogsInDto } from '../dto/get-all-blog.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class BlogService {
    constructor(
        private readonly blogRepository: Repository<Blog>,
        private readonly blogCategoryRepository: Repository<BlogCategory>,
        private readonly blogTagRepository: Repository<BlogTag>

    ) { }

    async createBlog(createBlogDto: CreateBlogInDto): Promise<Blog> {
        // Check slug is duplicate
        const existingSlug = await this.blogRepository.findOne({
            where: { slug: createBlogDto.slug }
        })

        if (existingSlug) {
            throw new ConflictException('Slug already exists');
        }

        // Validate category
        const category = await this.blogCategoryRepository.findOne({
            where: { id: createBlogDto.categoryId }
        })
        if (!category) {
            throw new NotFoundException('Category not found');
        }

        // Lấy danh sách tags
        const tags = await this.blogTagRepository.find({
            where: { id: In(createBlogDto.tagIds || []) },
        })

        if (tags.length !== (createBlogDto.tagIds?.length || 0)) {
            throw new NotFoundException('One or more tags not found');
        }

        const blog = this.blogRepository.create({
            ...createBlogDto,
            category,
            tags,
        })

        return this.blogRepository.save(blog);
    }

    async updateBlog(id: number, updateDto: UpdateBlogInDto): Promise<Blog> {
        const blog = await this.blogRepository.findOne({ where: { id }, relations: ['tags', 'category'] });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        if (updateDto.slug && updateDto.slug !== blog.slug) {
            const existing = await this.blogRepository.findOne({ where: { slug: updateDto.slug } });
            if (existing) {
                throw new ConflictException('Slug already exists');
            }
        }

        if (updateDto.categoryId) {
            const category = await this.blogCategoryRepository.findOne({
                where: { id: updateDto.categoryId },
            });
            if (!category) {
                throw new NotFoundException('Category not found');
            }
            blog.category = category;
        }

        if (updateDto.tagIds) {
            const tags = await this.blogTagRepository.find({
                where: { id: In(updateDto.tagIds) },
            });
            if (tags.length !== updateDto.tagIds.length) {
                throw new NotFoundException('One or more tags not found');
            }
            blog.tags = tags;
        }

        Object.assign(blog, updateDto);
        return this.blogRepository.save(blog);
    }

    async getAllBlogs(query: GetAllBlogsInDto): Promise<{ blogs: Blog[], total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE } = query;

        const [blogs, total] = await this.blogRepository.findAndCount({
            relations: ['category', 'tags'],
            skip: (page - 1) * perPage,
            take: perPage,
            order: { created_at: 'DESC' }
        });

        return { blogs, total };
    }

    async getBlogById(id: number): Promise<Blog> {
        const blog = await this.blogRepository.findOne({
            where: { id },
            relations: ['category', 'tags'],
        });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }
        return blog;
    }

    async deleteBlog(id: number): Promise<void> {
        const blog = await this.blogRepository.findOne({ where: { id } });
        if (!blog) {
            throw new NotFoundException('Blog not found');
        }

        await this.blogRepository.remove(blog);
    }
}