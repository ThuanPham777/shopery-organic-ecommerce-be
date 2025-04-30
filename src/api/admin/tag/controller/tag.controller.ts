import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateTagDto } from '../dto/update-tag.dto';
import { createTagDto } from '../dto/create-tag.dto';
import { TagService } from '../service/tag.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('Admin / Tag')
@Controller('admin/tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTags() {
    return this.tagService.getAllTags();
  }

  @Get(':tagId')
  @UseGuards(JwtAuthGuard)
  async getTagById(@Param('tagId') tagId: number) {
    return this.tagService.getTagById(tagId);
  }

  @Post('create')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  async createTag(@Body() createTagDto: createTagDto) {
    return this.tagService.createTag(createTagDto);
  }

  @Patch(':tagId/update')
  @UsePipes(new ValidationPipe({ transform: true }))
  @UseGuards(JwtAuthGuard)
  async updateTag(
    @Param('tagId') tagId: number,
    @Body() updateTagDto: updateTagDto,
  ) {
    return this.tagService.updateTag(tagId, updateTagDto);
  }

  @Delete(':tagId/delete')
  @UseGuards(JwtAuthGuard)
  async deleteTag(@Param('tagId') tagId: number) {
    return this.tagService.deleteTag(tagId);
  }
}
