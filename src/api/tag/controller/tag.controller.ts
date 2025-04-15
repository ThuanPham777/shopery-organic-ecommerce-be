import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateTagDto } from '../dto/update-tag.dto';
import { createTagDto } from '../dto/create-tag.dto';
import { TagService } from '../service/tag.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  async getAllTags() {
    return this.tagService.getAllTags();
  }

  @Get(':tagId')
  async getTagById(@Param('tagId') tagId: number) {
    return this.tagService.getTagById(tagId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTag(@Body() createTagDto: createTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Patch(':tagId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTag(
    @Param('tagId') tagId: number,
    @Body() updateTagDto: updateTagDto,
  ) {
    return this.tagService.updateTag(tagId, updateTagDto);
  }

  @Delete(':tagId/delete')
  async deleteTag(@Param('tagId') tagId: number) {
    return this.tagService.deleteTag(tagId);
  }
}
