import {
  Entity,
  Column,
} from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED = 'fixed_amount',
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
  coupon_value: number; // Giá trị giảm giá, nếu coupon_type là 'percent' thì giá trị này sẽ là phần trăm giảm, còn nếu coupon_type là 'fixed_amount' thì giá trị này sẽ là số tiền cố định giảm

  @Column({ type: 'date', nullable: true })
  coupon_start_date: Date; // Ngày bắt đầu áp dụng coupon

  @Column({ type: 'date', nullable: true })
  coupon_end_date: Date; // Ngày kết thúc áp dụng coupon

  @Column({ type: 'int', nullable: true })
  used_count: number; // Số lần sử dụng coupon

  @Column({ type: 'int', nullable: true })
  usage_limit: number; // Số lần sử dụng coupon tối đa

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coupon_min_spend: number; // Số tiền tối thiểu để sử dụng coupon

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  coupon_max_spend: number; // Số tiền tối đa để sử dụng coupon

  @Column({ type: 'enum', enum: CouponStatus })
  coupon_status: CouponStatus;
}
