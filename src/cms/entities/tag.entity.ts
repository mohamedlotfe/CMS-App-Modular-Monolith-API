import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Content } from './content.entity';

@Entity('tag')
export class Tag {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @ManyToMany(() => Content, (content) => content.tags)
  @JoinTable({
    name: 'content_tag',
    joinColumn: { name: 'tag_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'content_id', referencedColumnName: 'id' },
  })
  contents: Content[];
}
