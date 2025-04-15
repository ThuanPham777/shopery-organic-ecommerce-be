import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class createManufacturerDto {
  @ApiProperty({ example: 'Green Farm Organics' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
