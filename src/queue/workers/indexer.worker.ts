import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { Injectable } from '@nestjs/common';
import { SearchService } from '../../search/search.service';
import { CmsService } from '../../cms/cms.service';
import { IndexingJobData, IndexingJobResult } from '../jobs/indexing.jobs';
import { Content } from '../../cms/entities/content.entity';

@Injectable()
@Processor('indexing')
export class IndexerWorker {
  constructor(
    private readonly searchService: SearchService,
    private readonly cmsService: CmsService,
  ) {}

  @Process()
  async handleIndexing(job: Job<IndexingJobData>): Promise<IndexingJobResult> {
    const { contentId, operation } = job.data;

    try {
      switch (operation) {
        case 'INDEX':
        case 'UPDATE': {
          await this.handleIndexOrUpdate(contentId, operation);
          break;
        }
        case 'DELETE':
          await this.searchService.deleteContent(contentId);
          break;
        default:
          throw new Error(`Unknown operation: ${String(operation)}`);
      }

      return { success: true };
    } catch (error) {
      console.error(
        `Error processing indexing job for content ${contentId}:`,
        error,
      );
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async handleIndexOrUpdate(
    contentId: string,
    operation: string,
  ): Promise<void> {
    const content = await this.fetchContentFromDatabase(contentId);

    if (!content) {
      console.error(`Content ${contentId} not found for ${operation}`);
      return;
    }

    const contentForIndex = this.transformContentForIndexing(content);
    await this.performIndexingOperation(contentForIndex, operation);

    console.log(
      `Successfully ${operation.toLowerCase()}ed content ${contentId}`,
    );
  }

  private async fetchContentFromDatabase(contentId: string) {
    return await this.cmsService.findContentById(contentId);
  }

  private transformContentForIndexing(content: Content) {
    return {
      id: content.id,
      title: content.title,
      body: content.body,
      author: {
        id: content.author.id,
        name: content.author.name,
      },
      tags: content.tags.map((tag) => ({
        id: tag.id,
        name: tag.name,
      })),
      created_at: content.createdAt,
      updated_at: content.updatedAt,
      published: content.published,
    };
  }

  private async performIndexingOperation(
    contentForIndex: any,
    operation: string,
  ): Promise<void> {
    if (operation === 'INDEX') {
      await this.searchService.indexContent(contentForIndex);
    } else {
      await this.searchService.updateContent(contentForIndex);
    }
  }
}
