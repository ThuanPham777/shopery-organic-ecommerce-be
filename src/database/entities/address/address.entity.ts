import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping',
}

@Entity({ name: 'Address' })
export class Address extends BaseEntity {
  @Column({ length: 255, nullable: true })
  address: string;

  @Column({ length: 255, nullable: true })
  city: string;

  @Column({ length: 255, nullable: true })
  state: string;

  @Column({ length: 255, nullable: true })
  zip_code: string;

  @Column({ type: 'enum', enum: AddressType })
  address_type: AddressType;
}
