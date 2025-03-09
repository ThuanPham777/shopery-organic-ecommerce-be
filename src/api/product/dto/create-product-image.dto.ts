import { IsNotEmpty, IsString } from 'class-validator';
import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class CreateProductImageDto {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  product_id: number;

  @IsNotEmpty()
  @IsString()
  image_url: string;
}