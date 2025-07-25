import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { AttributeValue } from './attribute-value.entity';
@Entity({ name: 'Attribute' })
export class Attribute extends BaseEntity {
  @Column({ length: 255, nullable: true })
  name: string;

  @Column({ length: 255, nullable: true })
  description: string;

  @OneToMany(() => AttributeValue, (value) => value.attribute)
  values: AttributeValue[];
}
