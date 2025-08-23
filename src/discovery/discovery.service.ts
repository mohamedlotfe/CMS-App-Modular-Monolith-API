import { Injectable } from '@nestjs/common';
import { SearchService } from '../search/search.service';
import { SearchQuery, SearchResponse } from '../search/search.types';

@Injectable()
export class DiscoveryService {
  constructor(private readonly searchService: SearchService) {}

  async search(query: SearchQuery): Promise<SearchResponse> {
    return this.searchService.searchContent(query);
  }
}
