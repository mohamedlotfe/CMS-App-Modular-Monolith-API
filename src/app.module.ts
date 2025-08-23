import { Module } from '@nestjs/common';
import { ConfigModule } from './common/config/config.module';
import { DatabaseModule } from './database/database.module';
import { SearchModule } from './search/search.module';
import { QueueModule } from './queue/queue.module';
import { CmsModule } from './cms/cms.module';
import { DiscoveryModule } from './discovery/discovery.module';
import { IngestModule } from './ingest/ingest.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [
    ConfigModule,
    DatabaseModule,
    SearchModule,
    QueueModule,
    CmsModule,
    DiscoveryModule,
    IngestModule,
    HealthModule,
  ],
})
export class AppModule {}
