import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Column } from 'typeorm';

export class CreateProductImageDto {
  @ApiProperty({ example: '1' })
  @Column()
  product_id: number;

  @ApiProperty({ example: 'milk1.jpg' })
  @IsNotEmpty()
  @IsString()
  image_url: string;
}
