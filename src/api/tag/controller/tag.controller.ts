import { Controller, Get } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { ApiTags } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  async getNameOfAllTags() {
    const tagsName = await this.tagService.getNameOfAllTags();

    return new ApiRes(tagsName, SUCCESS);
  }
}
