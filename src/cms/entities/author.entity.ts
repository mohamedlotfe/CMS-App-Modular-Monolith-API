import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Content } from './content.entity';

@Entity('author')
export class Author {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'email', type: 'text' })
  email: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => Content, (content) => content.author)
  contents: Content[];
}
