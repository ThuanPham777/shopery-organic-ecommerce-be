import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderDetail } from './order-detail.entity';
import { Product } from '../product/product.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'OrderItem' })
export class OrderItem extends BaseEntity {
  @Column({ type: 'int' })
  quantity: number;

  @ManyToOne(() => OrderDetail, (order) => order.items)
  @JoinColumn({ name: 'order_id' })
  order: OrderDetail;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;
}
