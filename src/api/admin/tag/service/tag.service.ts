import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Repository } from 'typeorm';
import { createTagDto } from '../dto/create-tag.dto';
import { updateTagDto } from '../dto/update-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) {}

  async getAllTags() {
    const tags = await this.tagRepository.find({
      relations: [
        'products',
        'products.manufacturer',
        'products.category',
        'products.tags',
        'products.images',
      ],
    });

    if (!tags) {
      throw new NotFoundException('Tag Not Found');
    }
    return {
      data: tags,
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
