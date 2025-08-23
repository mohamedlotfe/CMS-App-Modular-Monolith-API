import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { IndexerWorker } from './workers/indexer.worker';
import { SearchModule } from '../search/search.module';
import { CmsModule } from '../cms/cms.module';

@Module({
  imports: [
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get('REDIS.HOST'),
          port: configService.get('REDIS.PORT'),
        },
      }),
      inject: [ConfigService],
    }),
    BullModule.registerQueue({
      name: 'indexing',
    }),
    SearchModule,
    CmsModule,
  ],
  providers: [IndexerWorker],
  exports: [BullModule],
})
export class QueueModule {}
