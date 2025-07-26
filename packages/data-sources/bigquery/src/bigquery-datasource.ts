import type { ColumnDefinition, TableDefinition } from '@contexthub/core';
import {
  type DataSource,
  GetColumnsListParams,
  type QueryResult,
  registry,
} from '@contexthub/data-sources-common';

export class BigQueryDataSource implements DataSource {
  constructor({ credentials }: { credentials: Record<string, string> }) {
    for (const field of credentialsFields) {
      if (field.isRequired && !credentials[field.name]) {
        throw new Error(`Missing required field ${field.name}`);
      }
    }
  }

  async testConnection() {
    return true;
  }

  async executeQuery(query: string): Promise<QueryResult> {
    return { rows: [] };
  }

  async getTablesList(): Promise<TableDefinition[]> {
    return [];
  }

  async getColumnsList(
    params: GetColumnsListParams
  ): Promise<ColumnDefinition[]> {
    return [];
  }
}

const credentialsFields = [{ name: 'credentialsJson', isRequired: true }];

registry.register({
  type: 'bigquery',
  name: 'BigQuery',
  credentialsFields,
  factory: ({ credentials }: { credentials: Record<string, string> }) =>
    new BigQueryDataSource({ credentials }),
});
