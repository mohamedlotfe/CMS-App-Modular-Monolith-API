import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { IngestService } from './ingest.service';

@Controller('ingest')
export class IngestController {
  constructor(private readonly ingestService: IngestService) {}

  @Post('sources')
  createIngestSource(
    @Body() body: { name: string; type: string; config: any },
  ) {
    return this.ingestService.createIngestSource(
      body.name,
      body.type,
      body.config,
    );
  }

  @Post('jobs/:sourceId/start')
  startIngestJob(@Param('sourceId') sourceId: string) {
    return this.ingestService.startIngestJob(sourceId);
  }

  @Get('jobs')
  getAllIngestJobs() {
    return this.ingestService.getAllIngestJobs();
  }

  @Get('jobs/:id')
  getIngestJob(@Param('id') id: string) {
    return this.ingestService.getIngestJob(id);
  }
}
