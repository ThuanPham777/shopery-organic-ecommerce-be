import { ApiProperty } from '@nestjs/swagger';
import { ApiPag, ApiPagRes } from 'src/type/custom-response.type';

export class GetAllAttributeValuesOutDto {
  @ApiProperty()
  value: string;

  @ApiProperty()
  created_at: Date;

  @ApiProperty()
  modified_at: Date;
}

export class GetAllAttributeValesPagDto extends ApiPag {
  @ApiProperty({ type: GetAllAttributeValuesOutDto, isArray: true })
  declare items: GetAllAttributeValuesOutDto[];
}

export class GetAllAttributeValuesOutRes extends ApiPagRes {
  @ApiProperty({ type: GetAllAttributeValesPagDto })
  declare data: GetAllAttributeValesPagDto;
}
