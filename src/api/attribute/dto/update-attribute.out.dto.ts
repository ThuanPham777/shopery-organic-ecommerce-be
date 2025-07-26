import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ApiRes } from 'src/type/custom-response.type';

export class UpdateAttributeOutDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  modified_at: Date;
}

export class UpdateAttributeOutRes extends ApiRes<UpdateAttributeOutDto> {
  @ApiProperty({ type: UpdateAttributeOutDto })
  declare data: UpdateAttributeOutDto;
}
