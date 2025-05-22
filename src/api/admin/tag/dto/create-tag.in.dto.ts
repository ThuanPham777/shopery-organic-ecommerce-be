import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTagInDto {
  @ApiProperty({ example: 'Fresh' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
