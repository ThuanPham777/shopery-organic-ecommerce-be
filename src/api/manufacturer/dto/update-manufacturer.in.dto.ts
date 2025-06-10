import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class UpdateManufacturerInDto {
  @ApiProperty({ example: 'Green Farm Organics' })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name?: string;
}
