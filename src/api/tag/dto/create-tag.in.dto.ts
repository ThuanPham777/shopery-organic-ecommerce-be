import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { INVALID_REQUIRED, INVALID_STRING } from 'src/contants/invalid.constant';

export class CreateTagInDto {
  @ApiProperty({ example: 'Fresh' })
  @IsNotEmpty({ message: INVALID_REQUIRED })
  @IsString({ message: INVALID_STRING })
  name: string;
}
