import { Controller, Get } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  async getAllTags() {
    const tags = await this.tagService.getAllTags();

    return new ApiRes(tags, 'Get all tags successfully');
  }
}
