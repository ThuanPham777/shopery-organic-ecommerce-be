import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { AttributeService } from '../service/attribute.service';
import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { GetAllAttributesInDto } from '../dto/get-all-attributes.in.dto';
import { ApiPagRes } from 'src/type/custom-response.type';
import { GetAllAttributesOutRes } from '../dto/get-all-attributes.out.dto';
import { SUCCESS } from 'src/contants/response.constant';

@ApiTags('Attribute')
@Controller('attribute')
export class AttributeController {
  constructor(private attributeService: AttributeService) {}

  @Get()
  @ApiOkResponse({ type: GetAllAttributesOutRes })
  async findAllAttributes(@Query() query: GetAllAttributesInDto) {
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
}
