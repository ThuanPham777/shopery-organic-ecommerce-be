import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Tag' })
export class Tag extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @ManyToMany(() => Product, (product) => product.tags)
  products: Product;
}
