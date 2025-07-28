import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';
import { CategoryAttribute } from './category-attribute.entity';

@Entity({ name: 'Category' })
export class Category extends BaseEntity {
  @Column({ length: 255, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  slug: string;

  @Column({ length: 255, nullable: true })
  image: string;

  @OneToMany(() => Product, (product) => product.category)
  products: Product[];

  // Quan hệ đệ quy: Nhiều danh mục con thuộc về một danh mục cha
  @ManyToOne(() => Category, (category) => category.children, {
    nullable: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_id' })
  parent: Category | null;

  // Quan hệ đệ quy: Một danh mục cha có nhiều danh mục con
  @OneToMany(() => Category, (category) => category.parent, {
    cascade: true,
  })
  children: Category[];

  @OneToMany(() => CategoryAttribute, (ca) => ca.category)
  categoryAttributes: CategoryAttribute[];
}
