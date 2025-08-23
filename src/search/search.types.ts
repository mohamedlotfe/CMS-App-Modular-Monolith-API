export interface SearchResult {
  id: string;
  title: string;
  snippet: string;
  tags: string[];
  author: {
    id: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface SearchQuery {
  q: string;
  tags?: string[] | string;
  author?: string;
  published?: boolean;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  results: SearchResult[];
  total: number;
  page: number;
  limit: number;
}
