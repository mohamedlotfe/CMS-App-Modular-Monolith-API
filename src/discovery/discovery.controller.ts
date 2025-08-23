import { Controller, Get, Query } from '@nestjs/common';
import { DiscoveryService } from './discovery.service';
import { SearchQuery } from '../search/search.types';

@Controller('discovery')
export class DiscoveryController {
  constructor(private readonly discoveryService: DiscoveryService) {}

  @Get('search')
  search(@Query() query: SearchQuery) {
    return this.discoveryService.search(query);
  }
}
