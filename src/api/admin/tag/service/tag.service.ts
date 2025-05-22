import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Repository } from 'typeorm';
import { CreateTagInDto } from '../dto/create-tag.in.dto';
import { UpdateTagInDto } from '../dto/update-tag.in.dto';
import { GetAllTagsInDto } from '../dto/get-all-tags.in.dto';
import { DEFAULT_PER_PAGE } from 'src/contants/common.constant';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) { }

  async getAllTags(query: GetAllTagsInDto): Promise<{ tags: Tag[]; total: number }> {
    const { page = 1, perPage = DEFAULT_PER_PAGE } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const [tags, total] = await this.tagRepository.findAndCount({
      relations: [
        'products',
        'products.manufacturer',
        'products.category',
        'products.brand',
        'products.images',
      ],
      skip,
      take,
    });

    return {
      tags,
      total,
    };
  }

  async getTagById(tagId: number): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag Not Found');
    }

    return tag;
  }

  async createTag(createTagDto: CreateTagInDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
    });

    const newTag = await this.tagRepository.save(tag);

    return newTag;
  }

  async updateTag(tagId: number, updateTagDto: UpdateTagInDto): Promise<Tag> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    Object.assign(tag, updateTagDto);

    const updatedTag = await this.tagRepository.save(tag);

    return updatedTag;
  }

  async deleteTag(tagId: number): Promise<boolean> {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.delete({ id: tagId });

    return true;
  }
}
