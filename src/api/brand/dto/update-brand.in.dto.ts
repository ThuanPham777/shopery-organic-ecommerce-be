import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class updateBrandDto {
  @ApiProperty({
    description: 'The brand name',
    example: 'Organic Valley',
  })
  @IsOptional({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name?: string;
}
