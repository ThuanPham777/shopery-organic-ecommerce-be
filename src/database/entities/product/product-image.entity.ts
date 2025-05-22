import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from './product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'ProductImages' })
export class ProductImages extends BaseEntity {
  @Column({ name: 'image_url', length: 255, nullable: true })
  image_url: string;

  @ManyToOne(() => Product, (product) => product.images, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
