import { ApiProperty } from '@nestjs/swagger';
import { ApiPag, ApiPagRes } from 'src/type/custom-response.type';

export class GetAllAttributesOutDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;
}

export class GetAllAttributesPagDto extends ApiPag {
  @ApiProperty({ type: GetAllAttributesOutDto, isArray: true })
  declare items: GetAllAttributesOutDto[];
}

export class GetAllAttributesOutRes extends ApiPagRes {
  @ApiProperty({ type: GetAllAttributesPagDto })
  declare data: GetAllAttributesPagDto;
}
