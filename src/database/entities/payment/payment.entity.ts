import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';

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

  @Column({ type: 'int', nullable: true })
  transaction_id: number;

  @Column({ type: 'enum', enum: PaymentMethod })
  method: PaymentMethod;

  @Column({ type: 'enum', enum: PaymentStatus })
  status: PaymentStatus;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
