import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { IngestSource } from './entities/ingest-source.entity';
import { IngestJob } from './entities/ingest-job.entity';
import { CmsService } from '../cms/cms.service';

@Injectable()
export class IngestService {
  constructor(
    @InjectRepository(IngestSource)
    private ingestSourceRepository: Repository<IngestSource>,
    @InjectRepository(IngestJob)
    private ingestJobRepository: Repository<IngestJob>,
    @InjectQueue('indexing')
    private indexingQueue: Queue,
    private cmsService: CmsService,
  ) {}

  async createIngestSource(
    name: string,
    type: string,
    config: any,
  ): Promise<IngestSource> {
    const source = this.ingestSourceRepository.create({
      name,
      type,
      configJson: JSON.stringify(config),
    });
    return this.ingestSourceRepository.save(source);
  }

  async startIngestJob(sourceId: string): Promise<IngestJob> {
    const source = await this.ingestSourceRepository.findOne({
      where: { id: sourceId },
    });
    if (!source) {
      throw new Error('Ingest source not found');
    }

    const job = this.ingestJobRepository.create({
      sourceId,
      status: 'RUNNING',
    });

    const savedJob = await this.ingestJobRepository.save(job);

    // Process the ingest job asynchronously
    void this.processIngestJob(savedJob.id, source);

    return savedJob;
  }

  async getIngestJob(id: string): Promise<IngestJob | null> {
    return this.ingestJobRepository.findOne({
      where: { id },
      relations: ['source'],
    });
  }

  async getAllIngestJobs(): Promise<IngestJob[]> {
    return this.ingestJobRepository.find({
      relations: ['source'],
    });
  }

  private async processIngestJob(
    jobId: string,
    source: IngestSource,
  ): Promise<void> {
    try {
      const config = JSON.parse(source.configJson) as Record<string, unknown>;

      // Example: Process CSV import
      if (source.type === 'CSV') {
        await this.processCsvImport(jobId, config);
      } else if (source.type === 'RSS') {
        await this.processRssImport(jobId, config);
      }

      // Update job status to completed
      await this.ingestJobRepository.update(jobId, {
        status: 'COMPLETED',
        finishedAt: new Date(),
      });
    } catch (error) {
      // Update job status to failed
      await this.ingestJobRepository.update(jobId, {
        status: 'FAILED',
        errorMessage: error instanceof Error ? error.message : 'Unknown error',
        finishedAt: new Date(),
      });
    }
  }

  private async processCsvImport(
    jobId: string,
    config: Record<string, unknown>,
  ): Promise<void> {
    // This is a placeholder implementation
    // In a real implementation, you would:
    // 1. Read the CSV file
    // 2. Parse the data
    // 3. Create content entries
    // 4. Enqueue indexing jobs

    console.log(`Processing CSV import for job ${jobId} with config:`, config);

    // Example: Create some sample content
    const author = await this.cmsService.createAuthor(
      'CSV Import Author',
      'csv@example.com',
    );

    await this.cmsService.createContent({
      title: 'Imported from CSV',
      body: 'This content was imported from a CSV file.',
      authorId: author.id,
      tags: ['imported', 'csv'],
      published: true,
    });

    // The indexing job will be automatically enqueued by the CMS service
  }

  private async processRssImport(
    jobId: string,
    config: Record<string, unknown>,
  ): Promise<void> {
    // This is a placeholder implementation
    // In a real implementation, you would:
    // 1. Fetch RSS feed
    // 2. Parse RSS items
    // 3. Create content entries
    // 4. Enqueue indexing jobs

    console.log(`Processing RSS import for job ${jobId} with config:`, config);

    // Example: Create some sample content
    const author = await this.cmsService.createAuthor(
      'RSS Import Author',
      'rss@example.com',
    );

    await this.cmsService.createContent({
      title: 'Imported from RSS',
      body: 'This content was imported from an RSS feed.',
      authorId: author.id,
      tags: ['imported', 'rss'],
      published: true,
    });

    // The indexing job will be automatically enqueued by the CMS service
  }
}
