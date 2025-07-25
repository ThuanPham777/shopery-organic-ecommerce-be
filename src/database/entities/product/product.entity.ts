import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from '../category/category.entity';
import { Brand } from '../brand/brand.entity';
import { Manufacturer } from '../manufacturer/manufacturer.entity';
import { Tag } from '../tag/tag.entity';
import { ProductImages } from '../product/product-image.entity';
import { Review } from '../review/review.entity';
import { BaseEntity } from '../base.entity';
import { ProductAttributeValue } from '../attribute/product-attribute-value.entity';
import { Wishlist } from '../wishlist/wishlist.entity';

export enum ProductStatus {
  IN_STOCK = 'In stock',
  OUT_OF_STOCK = 'Out of stock',
  COMING_SOON = 'Coming soon',
}

@Entity({ name: 'Product' })
export class Product extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, unique: true })
  slug: string;

  @Column({ type: 'varchar', length: 255 })
  short_description: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255 })
  thumbnail: string;

  @Column({ length: 255, unique: true })
  sku: string;

  @Column({ type: 'float' })
  price: number;

  @Column({ type: 'enum', enum: ProductStatus })
  status: ProductStatus;

  @Column({ type: 'int' })
  quantity: number;

  @Column({ type: 'int', nullable: true })
  sold: number;

  @Column({ type: 'boolean' })
  featured: boolean;

  @Column({ type: 'float', nullable: true })
  discount: number;

  // Quan hệ
  @ManyToOne(() => Category, (category) => category.products)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Brand, (brand) => brand.products)
  @JoinColumn({ name: 'brand_id' })
  brand: Brand;

  @ManyToOne(() => Manufacturer, (manufacturer) => manufacturer.products)
  @JoinColumn({ name: 'manufacturer_id' })
  manufacturer: Manufacturer;

  @ManyToMany(() => Tag, (tag) => tag.products)
  @JoinTable({
    name: 'ProductTag',
    joinColumn: {
      name: 'product_id', // Column name in the join table that references Product.id
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'tag_id', // Column name in the join table that references Tag.id
      referencedColumnName: 'id',
    },
  })
  tags: Tag[];

  // Quan hệ One-to-Many với ProductImage
  @OneToMany(() => ProductImages, (image) => image.product, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  images: ProductImages[];

  @OneToMany(() => Review, (review) => review.product)
  reviews: Review[];

  @OneToMany(() => ProductAttributeValue, (pav) => pav.product)
  productAttributeValues: ProductAttributeValue[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.product)
  wishlist: Wishlist[];
}
