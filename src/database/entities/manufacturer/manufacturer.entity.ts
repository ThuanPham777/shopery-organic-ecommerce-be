import {
  Entity,
  Column,
  OneToMany,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Manufacturer' })
export class Manufacturer extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @OneToMany(() => Product, (product) => product.manufacturer)
  products: Product[];
}
