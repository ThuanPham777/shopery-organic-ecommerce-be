import { Entity, Column, ManyToMany } from 'typeorm';
import { Blog } from './blog.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'BlogTag' })
export class BlogTag extends BaseEntity {
  @Column({ length: 255 })
  name: string;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blog: Blog;
}
