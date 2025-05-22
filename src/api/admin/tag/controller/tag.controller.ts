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
import { UpdateTagInDto } from '../dto/update-tag.in.dto';
import { CreateTagInDto } from '../dto/create-tag.in.dto';
import { TagService } from '../service/tag.service';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { GetAllTagsInDto } from '../dto/get-all-tags.in.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllTagsOutRes } from '../dto/get-all-tags.out.dto';
import { CreateTagOutRes } from '../dto/create-tag.out.dto';
import { UpdateTagOutRes } from '../dto/update-tag.out.dto';
import { EUserRole } from 'src/enums/user.enums';

@ApiTags('Admin / Tag')
@Controller('admin/tag')
@ApiBearerAuth('bearerAuth')
@UseGuards(JwtAuthGuard, RoleGuard)
export class TagController {
  constructor(private readonly tagService: TagService) { }

  @Get()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: GetAllTagsOutRes })
  async getAllTags(@Query() query: GetAllTagsInDto) {
    const { page, perPage } = query;

    const result = await this.tagService.getAllTags(query);

    return new ApiPagRes(result.tags, result.total, page, perPage, SUCCESS);
  }

  @Get(':tagId')
  @Roles(EUserRole.ADMIN)
  async getTagById(@Param('tagId') tagId: number) {
    const tag = await this.tagService.getTagById(tagId);

    return new ApiRes(tag, SUCCESS);
  }

  @Post()
  @Roles(EUserRole.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: CreateTagOutRes })
  async createTag(@Body() createTagDto: CreateTagInDto) {
    const newTag = await this.tagService.createTag(createTagDto);

    return new ApiRes(newTag, SUCCESS);
  }

  @Patch(':tagId')
  @Roles(EUserRole.ADMIN)
  @UsePipes(new ValidationPipe({ transform: true }))
  @ApiOkResponse({ type: UpdateTagOutRes })
  async updateTag(
    @Param('tagId') tagId: number,
    @Body() updateTagDto: UpdateTagInDto,
  ) {
    const updatedTag = await this.tagService.updateTag(tagId, updateTagDto);

    return new ApiRes(updatedTag, SUCCESS);
  }

  @Delete(':tagId')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: ApiNullableRes })
  async deleteTag(@Param('tagId') tagId: number) {
    await this.tagService.deleteTag(tagId);

    return new ApiNullableRes(null, SUCCESS);
  }
}
