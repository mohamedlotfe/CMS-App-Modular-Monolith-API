import { Injectable } from '@nestjs/common';
import { SearchQuery, SearchResponse, SearchResult } from './search.types';

interface ElasticsearchHit {
  _source: Record<string, any>;
  highlight?: {
    body?: string[];
  };
}

interface ElasticsearchResponse {
  hits: {
    hits: ElasticsearchHit[];
    total: number | { value: number; relation: string };
  };
}

@Injectable()
export class SearchHelperService {
  buildSearchQuery(query: SearchQuery): Record<string, unknown> {
    const {
      q,
      tags: tagsParam,
      author,
      published,
      page = 1,
      limit = 10,
    } = query;

    // Handle tags parameter - it can be string or array
    const tags = Array.isArray(tagsParam)
      ? tagsParam
      : tagsParam
        ? tagsParam.split(',')
        : [];

    const must: any[] = [
      {
        multi_match: {
          query: q,
          fields: ['title^2', 'body', 'author.name', 'tags.name'],
        },
      },
    ];

    if (tags && tags.length > 0) {
      must.push({
        nested: {
          path: 'tags',
          query: {
            terms: {
              'tags.name': tags,
            },
          },
        },
      });
    }

    if (author) {
      must.push({
        match: { 'author.name': author },
      });
    }

    if (published !== undefined) {
      must.push({
        term: { published },
      });
    }

    return {
      from: (page - 1) * limit,
      size: limit,
      query: {
        bool: { must },
      },
      highlight: {
        fields: {
          title: {},
          body: { fragment_size: 150, number_of_fragments: 1 },
        },
      },
    };
  }

  processSearchResults(
    elasticsearchResult: ElasticsearchResponse,
    page: number,
    limit: number,
  ): SearchResponse {
    const results: SearchResult[] = elasticsearchResult.hits.hits.map(
      (hit: ElasticsearchHit) => {
        const source = hit._source;
        return {
          id: source.id as string,
          title: source.title as string,
          snippet:
            hit.highlight?.body?.[0] ||
            (source.body as string).substring(0, 150),
          tags:
            (source.tags as Array<{ name: string }>)?.map((tag) => tag.name) ||
            [],
          author: {
            id: (source.author as Record<string, unknown>).id as string,
            name: (source.author as Record<string, unknown>).name as string,
          },
          createdAt: source.created_at as Date,
          updatedAt: source.updated_at as Date,
          published: source.published as boolean,
        };
      },
    );

    return {
      results,
      total:
        typeof elasticsearchResult.hits.total === 'number'
          ? elasticsearchResult.hits.total
          : elasticsearchResult.hits.total.value,
      page,
      limit,
    };
  }

  getIndexMapping(): Record<string, unknown> {
    return {
      mappings: {
        properties: {
          id: { type: 'keyword' },
          title: {
            type: 'text',
            analyzer: 'standard',
            fields: {
              keyword: { type: 'keyword', ignore_above: 256 },
            },
          },
          body: {
            type: 'text',
            analyzer: 'standard',
          },
          author: {
            properties: {
              id: { type: 'keyword' },
              name: { type: 'text' },
            },
          },
          tags: {
            type: 'nested',
            properties: {
              id: { type: 'keyword' },
              name: { type: 'keyword' },
            },
          },
          created_at: { type: 'date' },
          updated_at: { type: 'date' },
          published: { type: 'boolean' },
        },
      },
    };
  }
}
