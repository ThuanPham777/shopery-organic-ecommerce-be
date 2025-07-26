import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { Attribute } from './attribute.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'AttributeValue' })
export class AttributeValue extends BaseEntity {
  @Column()
  attribute_id: number;

  @Column()
  value: string;

  @ManyToOne(() => Attribute, (attr) => attr.values)
  @JoinColumn({ name: 'attribute_id' })
  attribute: Attribute;
}
