import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class updateBrandDto {
  @ApiProperty({ example: 'Organic Valley' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
