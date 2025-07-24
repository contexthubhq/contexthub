import type { TableSystemMetadata } from '@contexthub/core';

export interface QueryResult {
  rows: any[];
}

export interface DataSource {
  testConnection(): Promise<boolean>;
  executeQuery(query: string): Promise<QueryResult>;
  getTablesList(): Promise<TableSystemMetadata[]>;
}
