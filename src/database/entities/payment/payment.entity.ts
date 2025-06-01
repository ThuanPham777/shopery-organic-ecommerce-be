import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { OrderDetail } from '../order/order-detail.entity';

export enum PaymentMethod {
  COD = 'Cash on Delivery',
  STRIPE = 'Stripe',
  PAYPAL = 'Paypal',
}

export enum PaymentStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

@Entity({ name: 'Payment' })
export class Payment extends BaseEntity {
  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  total: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'varchar', nullable: true })
  transaction_id: string;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;


  @ManyToOne(() => OrderDetail)
  @JoinColumn({ name: 'order_id' })
  order: OrderDetail;
}
