import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Author } from './author.entity';
import { Tag } from './tag.entity';

@Entity('content')
export class Content {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'title', type: 'text' })
  title: string;

  @Column({ name: 'body', type: 'text' })
  body: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId: string;

  @Column({ name: 'published', type: 'boolean', default: false })
  published: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Author, (author) => author.contents)
  author: Author;

  @ManyToMany(() => Tag, (tag) => tag.contents)
  @JoinTable({
    name: 'content_tag',
    joinColumn: { name: 'content_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];
}
