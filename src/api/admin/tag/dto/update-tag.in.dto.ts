import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateTagInDto {
  @ApiProperty({ example: 'Fresh' })
  @IsOptional()
  @IsString()
  name?: string;
}
