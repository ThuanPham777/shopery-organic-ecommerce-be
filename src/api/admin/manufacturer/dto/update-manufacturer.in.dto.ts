import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateManufacturerInDto {
  @ApiProperty({ example: 'Green Farm Organics' })
  @IsOptional()
  @IsString()
  name: string;
}
