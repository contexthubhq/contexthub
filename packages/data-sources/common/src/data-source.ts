import type { ColumnDefinition, TableDefinition } from '@contexthub/core';

export interface QueryResult {
  rows: any[];
}

export interface GetColumnsListParams {
  fullyQualifiedTableName: string;
}

export interface DataSource {
  testConnection(): Promise<boolean>;
  executeQuery(query: string): Promise<QueryResult>;
  getTablesList(): Promise<TableDefinition[]>;
  getColumnsList(params: GetColumnsListParams): Promise<ColumnDefinition[]>;
}
