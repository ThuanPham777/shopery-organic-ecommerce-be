import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Blog } from './blog.entity';
import { User } from '../user/user.entity';

@Entity({ name: 'BlogComment' })
export class BlogComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  content: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  modified_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => Blog, blog => blog.comments)
  @JoinColumn({ name: 'blog_id' })
  blog: Blog;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
