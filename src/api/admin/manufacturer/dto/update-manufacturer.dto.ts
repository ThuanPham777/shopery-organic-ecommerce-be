import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class updateManufacturerDto {
  @ApiProperty({ example: 'Green Farm Organics' })
  @IsOptional()
  @IsString()
  name: string;
}
