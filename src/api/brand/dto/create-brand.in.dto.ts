import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class createBrandInDto {
  @ApiProperty({
    description: 'The brand name',
    example: 'Organic Valley',
  })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name: string;
}
