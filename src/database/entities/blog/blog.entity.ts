import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { BlogCategory } from '../../entities/blog/blog-category.entity';
import { User } from '../user/user.entity';
import { BlogComment } from './blog-comment.entity';
import { BlogTag } from './blog-tags.entity';

@Entity({ name: 'Blog' })
export class Blog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ length: 255, unique: true, nullable: true })
  slug: string;

  @Column({ length: 255, nullable: true })
  thumbnail: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  modified_at: Date;

  @Column({ type: 'timestamp', nullable: true })
  deleted_at: Date;

  @ManyToOne(() => BlogCategory)
  @JoinColumn({ name: 'category_id' })
  category: BlogCategory;

 // Đổi tên thuộc tính thành blogTag
  @ManyToMany(() => BlogTag, blogTag => blogTag.blog)
    @JoinTable({ name: 'Blog_BlogTag' }) // Tên bảng trung gian
  tags: BlogTag[];

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @OneToMany(() => BlogComment, comment => comment.blog)
  comments: BlogComment[];
}
