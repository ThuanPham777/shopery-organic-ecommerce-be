import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createTagDto {
  @ApiProperty({ example: 'Fresh' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
