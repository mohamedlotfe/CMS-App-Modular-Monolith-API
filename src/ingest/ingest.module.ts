import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { IngestController } from './ingest.controller';
import { IngestService } from './ingest.service';
import { IngestSource } from './entities/ingest-source.entity';
import { IngestJob } from './entities/ingest-job.entity';
import { CmsModule } from '../cms/cms.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([IngestSource, IngestJob]),
    BullModule.registerQueue({
      name: 'indexing',
    }),
    CmsModule,
  ],
  controllers: [IngestController],
  providers: [IngestService],
})
export class IngestModule {}
