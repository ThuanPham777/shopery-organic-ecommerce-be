import { Entity, Column, ManyToOne, JoinColumn, Check } from 'typeorm';
import { Product } from '../product/product.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'Review' })
@Check(`rating >= 1 AND rating <= 5`)
export class Review extends BaseEntity {
  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @ManyToOne(() => Product, (product) => product.reviews)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
