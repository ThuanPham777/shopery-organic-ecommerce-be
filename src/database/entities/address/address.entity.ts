import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

export enum AddressType {
  BILLING = 'billing',
  SHIPPING = 'shipping'
}

@Entity({ name: 'Address' })
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

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

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
