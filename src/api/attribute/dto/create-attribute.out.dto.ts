import { ApiProperty } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

export class CreateAttributeOutDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  created_at: Date;
}

export class CreateAttributeOutRes extends ApiRes<CreateAttributeOutDto> {
  @ApiProperty({ type: CreateAttributeOutDto })
  declare data: CreateAttributeOutDto;
}
