import type { ColumnDefinition, TableDefinition } from '@contexthub/core';

export interface QueryResult {
  rows: any[];
}

export interface GetColumnsListParams {
  fullyQualifiedTableName: string;
}

export interface GetTablesListParams {
  /**
   * If provided, only tables in this list will be returned.
   */
  selectedTables?: {
    fullyQualifiedTableName: string;
  }[];
}

export interface DataSource {
  testConnection(): Promise<boolean>;
  executeQuery(query: string): Promise<QueryResult>;
  getTablesList(params?: GetTablesListParams): Promise<TableDefinition[]>;
  getColumnsList(params: GetColumnsListParams): Promise<ColumnDefinition[]>;
}
