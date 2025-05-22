import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class updateBrandDto {
  @ApiProperty({ example: 'Organic Valley' })
  @IsOptional()
  @IsString()
  name?: string;
}
