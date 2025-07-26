import { ApiProperty } from '@nestjs/swagger';
import { ApiRes } from 'src/type/custom-response.type';

export class UpdateAttributeValueOutDto {
  @ApiProperty()
  value: string;

  @ApiProperty()
  modified_at: Date;
}

export class UpdateAttributeValueOutRes extends ApiRes<UpdateAttributeValueOutDto> {
  @ApiProperty({ type: UpdateAttributeValueOutDto })
  declare data: UpdateAttributeValueOutDto;
}
