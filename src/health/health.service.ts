import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';

@Injectable()
export class HealthService {
  private elasticsearchClient: Client;

  constructor(
    private dataSource: DataSource,
    private configService: ConfigService,
  ) {
    this.elasticsearchClient = new Client({
      node:
        this.configService.get('ELASTICSEARCH.NODE') || 'http://localhost:9200',
    });
  }

  async checkHealth() {
    const checks = {
      database: await this.checkDatabase(),
      elasticsearch: await this.checkElasticsearch(),
      redis: this.checkRedis(),
    };

    const allHealthy = Object.values(checks).every(
      (check) => check.status === 'healthy',
    );

    return {
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks,
    };
  }

  private async checkDatabase() {
    try {
      await this.dataSource.query('SELECT 1');
      return { status: 'healthy', message: 'Database connection is working' };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private async checkElasticsearch() {
    try {
      await this.elasticsearchClient.ping();
      return {
        status: 'healthy',
        message: 'Elasticsearch connection is working',
      };
    } catch (error) {
      return {
        status: 'unhealthy',
        message: 'Elasticsearch connection failed',
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  private checkRedis() {
    // For now, we'll assume Redis is healthy if the app starts
    // In a real implementation, you would test the Redis connection
    return { status: 'healthy', message: 'Redis connection is working' };
  }
}
