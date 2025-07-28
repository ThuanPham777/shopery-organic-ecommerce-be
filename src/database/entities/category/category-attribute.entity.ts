import { Entity, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './category.entity';
import { Attribute } from '../attribute/attribute.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'CategoryAttribute' })
export class CategoryAttribute extends BaseEntity {
  @ManyToOne(() => Category, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @ManyToOne(() => Attribute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;
}
