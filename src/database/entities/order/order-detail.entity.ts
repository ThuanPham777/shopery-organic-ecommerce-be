import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { Payment } from '../payment/payment.entity';
import { Coupon } from '../coupon/coupon.entity';
import { OrderItem } from '../order/order-item.entity';
import { Address } from '../address/address.entity'

export enum OrderStatus {
  PENDING = 'Pending',
  PROCESSING = 'Processing',
  SHIPPED = 'Shipped',
  DELIVERED = 'Delivered'
}

@Entity({ name: 'OrderDetail' })
export class OrderDetail {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total: number;

  @Column({ type: 'enum', enum: OrderStatus, default: OrderStatus.PENDING })
  status: OrderStatus;

  @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
  shipping_fee: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  modified_at: Date;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'billing_address_id' })
  billingAddress: Address;

  @ManyToOne(() => Address)
  @JoinColumn({ name: 'shipping_address_id' })
  shippingAddress: Address;

  @ManyToOne(() => Payment)
  @JoinColumn({ name: 'payment_id' })
  payment: Payment;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @OneToMany(() => OrderItem, orderItem => orderItem.order)
  items: OrderItem[];
}
