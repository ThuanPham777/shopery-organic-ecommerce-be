import { Entity, Column, OneToMany } from 'typeorm';
import { Blog } from './blog.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'BlogCategory' })
export class BlogCategory extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255 })
  slug: string;

  @OneToMany(() => Blog, (blog) => blog.category)
  blogs: Blog[];
}
