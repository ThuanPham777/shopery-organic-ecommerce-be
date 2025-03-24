import { IsInt, IsNotEmpty, Min } from 'class-validator';
import { PrimaryGeneratedColumn } from 'typeorm';

export class CartItemDto {
  @PrimaryGeneratedColumn()
  id: number;

  @IsInt()
  @IsNotEmpty()
  product_id: number;

  @IsInt()
  @Min(1)
  quantity: number;
}
