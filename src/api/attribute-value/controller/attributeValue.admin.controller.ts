import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttributeValueService } from '../service/attributeValue.service';
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
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/api/auth/decorators/roles.decorator';
import { ApiNullableRes, ApiRes } from 'src/type/custom-response.type';
import { SUCCESS } from 'src/contants/response.constant';
import { EUserRole } from 'src/enums/user.enums';
import { CreateAttributeValueInDto } from '../dto/create-attribute-value.in.dto';
import { UpdateAttributeValueInDto } from '../dto/update-attribute-value.in.dto';
import { CreateAttributeValueOutRes } from '../dto/create-attribute-value.out.dto';
import { GetAllAttributeValuesOutRes } from '../dto/get-all-attribute-values.out.dto';
import { UpdateAttributeValueOutRes } from '../dto/update-attribute-value.out.dto';

@ApiTags('Admin / Attribute-Value')
@Controller('admin/attribute-value')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RoleGuard)
export class AttributeValueAdminController {
  constructor(private attributeValueService: AttributeValueService) {}

  @Post()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: CreateAttributeValueOutRes })
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() dto: CreateAttributeValueInDto) {
    const result = await this.attributeValueService.create(dto);
    return new ApiRes(result, SUCCESS);
  }

  @Get()
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: GetAllAttributeValuesOutRes })
  async findAll() {
    const result = await this.attributeValueService.findAll();
    return new ApiRes(result, SUCCESS);
  }

  @Get(':id')
  @Roles(EUserRole.ADMIN)
  async findById(@Param('id') id: number) {
    const result = await this.attributeValueService.findById(id);
    return new ApiRes(result, SUCCESS);
  }

  @Patch(':id')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: UpdateAttributeValueOutRes })
  async update(
    @Param('id') id: number,
    @Body() dto: UpdateAttributeValueInDto,
  ) {
    const result = await this.attributeValueService.update(id, dto);
    return new ApiRes(result, SUCCESS);
  }

  @Delete(':id')
  @Roles(EUserRole.ADMIN)
  @ApiOkResponse({ type: ApiNullableRes })
  async remove(@Param('id') id: number) {
    await this.attributeValueService.remove(id);
    return new ApiNullableRes(null, SUCCESS);
  }
}
