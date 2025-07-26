import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttributeService } from '../service/attribute.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { UseGuards } from '@nestjs/common';
import { CreateAttributeInDto } from '../dto/create-attribute.in.dto';
import { UpdateAttributeInDto } from '../dto/update-attribute.in.dto';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { EUserRole } from 'src/enums/user.enums';
import { CreateAttributeOutRes } from '../dto/create-attribute.out.dto';
import { GetAllAttributesOutRes } from '../dto/get-all-attributes.out.dto';
import { UpdateAttributeOutRes } from '../dto/update-attribute.out.dto';
import {
  ApiNullableRes,
  ApiPagRes,
  ApiRes,
} from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { GetAllAttributesInDto } from '../dto/get-all-attributes.in.dto';

@ApiTags('Admin / Attribute')
@Controller('admin/attribute')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AttributeAdminController {
  constructor(private readonly attributeService: AttributeService) {}

  @Post()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: CreateAttributeOutRes })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() dto: CreateAttributeInDto) {
    const newAttribute = await this.attributeService.create(dto);
    return new ApiRes(newAttribute, SUCCESS);
  }

  @Get()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: GetAllAttributesOutRes })
  async findAll(@Query() query: GetAllAttributesInDto) {
    const { page, perPage } = query;
    const result = await this.attributeService.findAll(query);
    return new ApiPagRes(
      result.attributes,
      result.total,
      page,
      perPage,
      SUCCESS,
    );
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async findById(@Param('id') id: number) {
    const attribute = await this.attributeService.findById(id);
    return new ApiRes(attribute, SUCCESS);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: UpdateAttributeOutRes })
  update(@Param('id') id: number, @Body() dto: UpdateAttributeInDto) {
    const updatedAttribute = this.attributeService.update(id, dto);
    return new ApiRes(updatedAttribute, SUCCESS);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: ApiNullableRes })
  remove(@Param('id') id: number) {
    this.attributeService.remove(id);
    return new ApiNullableRes(null, SUCCESS);
  }
}
