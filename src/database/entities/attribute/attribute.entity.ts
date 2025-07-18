import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';
@Entity({ name: 'Attribute' })
export class Attribute extends BaseEntity {
    @Column({ length: 255, nullable: true })
    name: string;

    @Column({ length: 255, nullable: true })
    description: string;
}