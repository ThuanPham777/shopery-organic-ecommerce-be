import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateAttributeValueInDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  value?: string;
}
