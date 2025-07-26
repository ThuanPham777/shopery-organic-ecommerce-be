import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class CreateAttributeValueInDto {
  @ApiProperty()
  @IsNumber()
  attribute_id: number;

  @ApiProperty()
  @IsString()
  value: string;
}
