import {
  type DataSource,
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
}

const credentialsFields = [{ name: 'credentialsJson', isRequired: true }];

registry.register({
  type: 'bigquery',
  name: 'BigQuery',
  credentialsFields,
  factory: ({ credentials }: { credentials: Record<string, string> }) =>
    new BigQueryDataSource({ credentials }),
});
