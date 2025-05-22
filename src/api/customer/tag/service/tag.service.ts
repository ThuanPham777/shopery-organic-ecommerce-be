import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Tag } from 'src/database/entities/tag/tag.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,
  ) { }

  async getAllTags(): Promise<Tag[]> {
    const tags = await this.tagRepository.find();

    if (!tags) {
      throw new NotFoundException('Tag Not Found');
    }
    return tags;
  }
}
