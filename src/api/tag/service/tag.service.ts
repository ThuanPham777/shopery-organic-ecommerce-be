import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Repository } from 'typeorm';
import { UpdateTagInDto } from '../dto/update-tag.in.dto';
import { CreateTagInDto } from '../dto/create-tag.in.dto';
import { GetAllTagsInDto } from '../dto/get-all-tags.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';
import { GetAllBrandsOutDto } from 'src/api/brand/dto/get-all-brands.out.dto';
import GetAllTagsOutDto from '../dto/get-all-tags.out.dto';
import { CreateTagOutDto } from '../dto/create-tag.out.dto';
import { UpdateTagOutDto } from '../dto/update-tag.out.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) { }

  async getNameOfAllTags(): Promise<string[]> {
    const tags = await this.tagRepository.find();

    if (!tags) {
      throw new NotFoundException('Tag Not Found');
    }
    return tags.map((tag) => tag.name);
  }

  async getAllTags(query: GetAllTagsInDto): Promise<{ tags: GetAllTagsOutDto[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE, search } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const qb = this.tagRepository.createQueryBuilder('tag')
      .leftJoin('tag.products', 'product')
      .select([
        'tag.id',
        'tag.name',
        'tag.created_at',
        'COUNT(product.id) AS product_count',
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
      this.tagRepository.createQueryBuilder('tag')
        .where(search ? 'tag.name LIKE :search' : 'TRUE', search ? { search: `%${search}%` } : {})
        .getCount(),
    ]);

    const tags: GetAllTagsOutDto[] = rawTags.map(raw => ({
      id: raw.tag_id,
      name: raw.tag_name,
      created_at: raw.tag_created_at,
      product_count: parseInt(raw.product_count, 10),
    }));

    return { tags, total };
  }

  async createTag(createTagDto: CreateTagInDto): Promise<CreateTagOutDto> {
    const newTag = this.tagRepository.create(createTagDto);
    return this.tagRepository.save(newTag);
  }

  async updateTag(tagId: number, updateTagDto: UpdateTagInDto): Promise<UpdateTagOutDto> {
    const updatedTag = await this.tagRepository.update(tagId, updateTagDto);
    return updatedTag.raw;
  }

  async deleteTag(tagId: number): Promise<void> {
    await this.tagRepository.delete(tagId);
  }
}
