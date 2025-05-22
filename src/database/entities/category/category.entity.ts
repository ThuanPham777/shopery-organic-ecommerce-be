import { Entity, Column, OneToMany } from 'typeorm';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Category' })
export class Category extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];
}
