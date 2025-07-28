import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Product } from '../product/product.entity';
import { AttributeValue } from './attribute-value.entity';

@Entity('ProductAttributeValue')
export class ProductAttributeValue extends BaseEntity {
  @Column()
  product_id: number;

  @Column()
  attribute_value_id: number;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => AttributeValue, { eager: true })
  @JoinColumn({ name: 'attribute_value_id' })
  attributeValue: AttributeValue;
}
