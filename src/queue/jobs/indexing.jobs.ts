export interface IndexingJobData {
  contentId: string;
  operation: 'INDEX' | 'UPDATE' | 'DELETE';
}

export interface IndexingJobResult {
  success: boolean;
  error?: string;
}
