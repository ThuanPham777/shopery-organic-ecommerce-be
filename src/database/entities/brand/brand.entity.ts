import { Entity, Column, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Brand' })
export class Brand extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.brand)
  products: Product[];
}
