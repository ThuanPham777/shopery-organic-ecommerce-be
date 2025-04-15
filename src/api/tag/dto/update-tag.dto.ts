import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class updateTagDto {
  @ApiProperty({ example: 'Fresh' })
  @IsOptional()
  @IsString()
  name?: string;
}
