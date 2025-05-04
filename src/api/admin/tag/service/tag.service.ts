import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Repository } from 'typeorm';
import { createTagDto } from '../dto/create-tag.dto';
import { updateTagDto } from '../dto/update-tag.dto';
import { GetAllTags } from '../dto/get-all-tags.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getAllTags(query: GetAllTags): Promise<{ tags: Tag[]; total: number }> {
    const { page = 1, perPage = 10 } = query;
    const skip = (page - 1) * perPage;
    const take = perPage;

    const [tags, total] = await this.tagRepository.findAndCount({
      relations: [
        'products',
        'products.manufacturer',
        'products.category',
        'products.tags',
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

  async createTag(createTagDto: createTagDto): Promise<Tag> {
    const tag = this.tagRepository.create({
      ...createTagDto,
    });

    const newTag = await this.tagRepository.save(tag);

    return newTag;
  }

  async updateTag(tagId: number, updateTagDto: updateTagDto): Promise<Tag> {
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
