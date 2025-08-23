import { Injectable, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@elastic/elasticsearch';
import { SearchQuery, SearchResponse } from './search.types';
import { SearchHelperService } from './search-helper.service';

@Injectable()
export class SearchService implements OnModuleInit {
  private client: Client;
  private index: string;

  constructor(
    private configService: ConfigService,
    private searchHelperService: SearchHelperService,
  ) {
    this.index = this.configService.get('ELASTICSEARCH.INDEX') || 'contents';
  }

  onModuleInit() {
    this.client = new Client({
      node:
        this.configService.get('ELASTICSEARCH.NODE') || 'http://localhost:9200',
      auth: {
        username: this.configService.get('ELASTICSEARCH.USERNAME') || '',
        password: this.configService.get('ELASTICSEARCH.PASSWORD') || '',
      },
    });
  }

  async indexContent(content: Record<string, unknown>) {
    return this.client.index({
      index: this.index,
      id: content.id as string,
      document: content,
      refresh: true,
    });
  }

  async updateContent(content: Record<string, unknown>) {
    return this.client.update({
      index: this.index,
      id: content.id as string,
      doc: content,
      refresh: true,
    });
  }

  async deleteContent(id: string) {
    return this.client.delete({
      index: this.index,
      id,
    });
  }

  async searchContent(query: SearchQuery): Promise<SearchResponse> {
    const searchQuery = this.searchHelperService.buildSearchQuery(query);
    const result = await this.client.search({
      index: this.index,
      ...searchQuery,
    });

    return this.searchHelperService.processSearchResults(
      result as any,
      query.page || 1,
      query.limit || 10,
    );
  }

  async createIndex() {
    const mapping = this.searchHelperService.getIndexMapping();

    try {
      await this.client.indices.create({
        index: this.index,
        body: mapping,
      });
    } catch (error: unknown) {
      if (
        error instanceof Error &&
        error.message !== 'resource_already_exists_exception'
      ) {
        throw error;
      }
    }
  }
}
