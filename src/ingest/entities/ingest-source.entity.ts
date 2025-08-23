import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { IngestJob } from './ingest-job.entity';

@Entity('ingest_source')
export class IngestSource {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'name', type: 'text' })
  name: string;

  @Column({ name: 'type', type: 'text' })
  type: string;

  @Column({ name: 'config_json', type: 'text' })
  configJson: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => IngestJob, (job) => job.source)
  jobs: IngestJob[];
}
