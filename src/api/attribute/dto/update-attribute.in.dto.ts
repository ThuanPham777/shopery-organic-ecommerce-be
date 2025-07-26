import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateAttributeInDto {
  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'name is required' })
  @IsString()
  @IsOptional()
  description?: string;
}
