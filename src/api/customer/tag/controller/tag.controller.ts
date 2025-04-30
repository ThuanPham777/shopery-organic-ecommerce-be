import { Controller, Get, UseGuards } from '@nestjs/common';
import { TagService } from '../service/tag.service';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';

@ApiTags('tag')
@Controller('tag')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getAllTags() {
    return this.tagService.getAllTags();
  }
}
