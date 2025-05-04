import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { updateTagDto } from '../dto/update-tag.dto';
import { createTagDto } from '../dto/create-tag.dto';
import { TagService } from '../service/tag.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllTags } from '../dto/get-all-tags.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Admin / Tag')
@Controller('admin/tag')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Get()
  @Roles('admin')
  async getAllTags(@Query() query: GetAllTags) {
    const { page, perPage } = query;

    const result = await this.tagService.getAllTags(query);

    return new ApiPagRes(result.tags, result.total, page, perPage, SUCCESS);
  }

  @Get(':tagId')
  @Roles('admin')
  async getTagById(@Param('tagId') tagId: number) {
    const tag = await this.tagService.getTagById(tagId);

    return new ApiRes(tag, SUCCESS);
  }

  @Post('create')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async createTag(@Body() createTagDto: createTagDto) {
    const newTag = await this.tagService.createTag(createTagDto);

    return new ApiRes(newTag, SUCCESS);
  }

  @Patch(':tagId/update')
  @Roles('admin')
  @UsePipes(new ValidationPipe({ transform: true }))
  async updateTag(
    @Param('tagId') tagId: number,
    @Body() updateTagDto: updateTagDto,
  ) {
    const updatedTag = await this.tagService.updateTag(tagId, updateTagDto);

    return new ApiRes(updatedTag, SUCCESS);
  }

  @Delete(':tagId/delete')
  @Roles('admin')
  async deleteTag(@Param('tagId') tagId: number) {
    await this.tagService.deleteTag(tagId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
