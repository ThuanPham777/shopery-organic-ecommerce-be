import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateAttributeInDto {
  @ApiProperty({
    example: 'color',
    description: 'name of attribute',
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  name: string;

  @ApiProperty({
    example: 'attribute color',
    description: 'description of attribute',
  })
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  description: string;
}
