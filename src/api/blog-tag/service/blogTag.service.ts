import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { BlogTag } from 'src/database/entities/blog/blog-tags.entity';
import { GetAllBlogTagsInDto } from '../dto/get-all-blog-tags.in.dto';
import GetAllBlogTagsOutDto from '../dto/get-all-blog-tags.out.dto';
import { CreateBlogTagInDto } from '../dto/create-blog-tag.in.dto';
import { CreateBlogTagOutDto } from '../dto/create-blog-tag.out.dto';
import { UpdateBlogTagInDto } from '../dto/update-blog-tag.in.dto';
import { UpdateBlogTagOutDto } from '../dto/update-blog-tag.out.dto';

@Injectable()
export class BlogTagService {
    constructor(
        @InjectRepository(BlogTag)
        private blogTagRepository: Repository<BlogTag>,
    ) { }

    async getNameOfAllBlogTags(): Promise<string[]> {
        const tags = await this.blogTagRepository.find();

        if (!tags) {
            throw new NotFoundException('Tag Not Found');
        }
        return tags.map((tag) => tag.name);
    }

    async getAllBlogTags(query: GetAllBlogTagsInDto): Promise<{ tags: GetAllBlogTagsOutDto[]; total: number }> {
        const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
        const skip = (page - 1) * perPage;
        const take = perPage;

        const qb = this.blogTagRepository.createQueryBuilder('tag')
            .leftJoin('tag.blogs', 'blog')
            .select([
                'tag.id',
                'tag.name',
                'tag.created_at',
                'COUNT(blog.id) AS blog_count',
            ])
            .groupBy('tag.id')
            .addGroupBy('tag.name')
            .addGroupBy('tag.created_at')
            .skip(skip)
            .take(take);

        if (search) {
            qb.andWhere('tag.name LIKE :search', { search: `%${search}%` });
        }

        const [rawTags, total] = await Promise.all([
            qb.getRawMany(),

            // Count filtered brands
            this.blogTagRepository.createQueryBuilder('tag')
                .where(search ? 'tag.name LIKE :search' : 'TRUE', search ? { search: `%${search}%` } : {})
                .getCount(),
        ]);

        const tags: GetAllBlogTagsOutDto[] = rawTags.map(raw => ({
            id: raw.tag_id,
            name: raw.tag_name,
            created_at: raw.tag_created_at,
            blog_count: parseInt(raw.blog_count, 10),
        }));

        return { tags, total };
    }

    async createBlogTag(createBlogTagDto: CreateBlogTagInDto): Promise<CreateBlogTagOutDto> {
        const newTag = this.blogTagRepository.create(createBlogTagDto);
        return this.blogTagRepository.save(newTag);
    }

    async updateTag(tagId: number, updateBlogTagDto: UpdateBlogTagInDto): Promise<UpdateBlogTagOutDto> {
        const updatedTag = await this.blogTagRepository.update(tagId, updateBlogTagDto);
        return updatedTag.raw;
    }

    async deleteTag(tagId: number): Promise<void> {
        await this.blogTagRepository.delete(tagId);
    }
}
