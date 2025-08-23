import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bull';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
import { CmsRepository } from './cms.repository';
import { Content } from './entities/content.entity';
import { Author } from './entities/author.entity';
import { Tag } from './entities/tag.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Content, Author, Tag]),
    BullModule.registerQueue({
      name: 'indexing',
    }),
  ],
  controllers: [CmsController],
  providers: [CmsService, CmsRepository],
  exports: [CmsService],
})
export class CmsModule {}
