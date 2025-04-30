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

  async getTagById(tagId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag Not Found');
    }

    return {
      data: tag,
    };
  }

  async createTag(createTagDto: createTagDto) {
    const tag = this.tagRepository.create({
      ...createTagDto,
    });

    const newTag = await this.tagRepository.save(tag);
    return {
      data: newTag,
      success: true,
      message: 'Tag created successfully',
    };
  }

  async updateTag(tagId: number, updateTagDto: updateTagDto) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    Object.assign(tag, updateTagDto);

    const updatedTag = await this.tagRepository.save(tag);

    return {
      data: updatedTag,
      success: true,
      message: 'Tag updated successfully',
    };
  }

  async deleteTag(tagId: number) {
    const tag = await this.tagRepository.findOne({
      where: { id: tagId },
    });

    if (!tag) {
      throw new NotFoundException('Tag not found');
    }

    await this.tagRepository.delete({ id: tagId });

    return { success: true, message: 'Tag deleted successfully' };
  }
}
