import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Blog } from './blog.entity';

@Entity({ name: 'BlogTag' })
export class BlogTag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  modified_at: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToMany(() => Blog, (blog) => blog.tags)
  blog: Blog;
}
