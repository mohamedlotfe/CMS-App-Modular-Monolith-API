import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('indexing_job')
export class IndexingJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'content_id', type: 'uuid' })
  contentId: string;

  @Column({ name: 'operation', type: 'text' })
  operation: string;

  @Column({ name: 'status', type: 'text' })
  status: string;

  @Column({ name: 'retry_count', type: 'int', default: 0 })
  retryCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
