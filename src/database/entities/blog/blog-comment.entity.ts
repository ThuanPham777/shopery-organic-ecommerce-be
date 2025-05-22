import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../user/user.entity';
import { BaseEntity } from '../base.entity';

@Entity({ name: 'BlogComment' })
export class BlogComment extends BaseEntity {
  @Column({ type: 'text' })
  content: string;

  @ManyToOne(() => Blog, (blog) => blog.comments)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
