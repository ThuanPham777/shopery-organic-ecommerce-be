import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../user/user.entity';
import { CartItem } from './cart-item.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Cart' })
export class Cart extends BaseEntity {
  @Column({ type: 'decimal', precision: 18, scale: 2 })
  total: number;

  @ManyToOne(() => User, (user) => user.carts)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => CartItem, (cartItem) => cartItem.cart)
  items: CartItem[];
}
