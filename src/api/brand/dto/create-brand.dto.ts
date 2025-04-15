import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class createBrandDto {
  @ApiProperty({ example: 'Organic Valley' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
