import { type DataSource, registry } from '@contexthub/data-sources-common';

export class BigQueryDataSource implements DataSource {
  private credentials: Record<string, string>;

  constructor({ credentials }: { credentials: Record<string, string> }) {
    for (const field of credentialsFields) {
      if (field.isRequired && !credentials[field.name]) {
        throw new Error(`Missing required field ${field.name}`);
      }
    }

    this.credentials = credentials;
  }

  async testConnection() {
    return true;
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
