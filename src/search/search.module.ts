import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchHelperService } from './search-helper.service';

@Module({
  providers: [SearchService, SearchHelperService],
  exports: [SearchService],
})
export class SearchModule {}
