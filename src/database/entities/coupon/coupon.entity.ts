import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed',
}

export enum CouponStatus {
  ACTIVE = 'active',
  EXPIRED = 'expired',
  DISABLED = 'disabled',
}

@Entity({ name: 'Coupon' })
export class Coupon extends BaseEntity {
  @Column({ length: 255, unique: true })
  coupon_code: string;

  @Column({ type: 'enum', enum: CouponType })
  coupon_type: CouponType;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  coupon_value: number;

  @Column({ type: 'date', nullable: true })
  coupon_start_date: Date;

  @Column({ type: 'date', nullable: true })
  coupon_end_date: Date;

  @Column({ type: 'int', nullable: true })
  used_count: number;

  @Column({ type: 'int', nullable: true })
  usage_limit: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coupon_min_spend: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coupon_max_spend: number;

  @Column({ type: 'enum', enum: CouponStatus })
  coupon_status: CouponStatus;
}
