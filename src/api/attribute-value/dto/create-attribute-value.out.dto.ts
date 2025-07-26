import { ApiProperty } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

export class CreateAttributeValueOutDto {
  @ApiProperty()
  value: string;

  @ApiProperty()
  created_at: Date;
}

export class CreateAttributeValueOutRes extends ApiRes<CreateAttributeValueOutDto> {
  @ApiProperty({ type: CreateAttributeValueOutDto })
  declare data: CreateAttributeValueOutDto;
}
