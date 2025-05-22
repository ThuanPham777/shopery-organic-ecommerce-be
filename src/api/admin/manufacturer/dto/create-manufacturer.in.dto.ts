import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateManufacturerInDto {
  @ApiProperty({ example: 'Green Farm Organics' })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;
}
