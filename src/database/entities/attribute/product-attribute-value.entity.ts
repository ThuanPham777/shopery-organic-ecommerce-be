import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Attribute } from './attribute.entity';
import { Product } from '../product/product.entity';

@Entity({ name: 'ProductAttributeValue' })
export class ProductAttributeValue extends BaseEntity {
    @Column()
    product_id: number;

    @Column()
    attribute_id: number;

    @Column({ type: 'varchar', length: 255 })
    value: string;


    @ManyToOne(() => Product, (product) => product.productAttributeValues)
    @JoinColumn({ name: 'product_id' })
    product: Product;

    @ManyToOne(() => Attribute)
    @JoinColumn({ name: 'attribute_id' })
    attribute: Attribute;
}