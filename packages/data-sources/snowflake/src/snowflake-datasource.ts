import { type DataSource, registry } from '@contexthub/data-sources-common';

export class SnowflakeDataSource implements DataSource {
  private credentials: Record<string, string>;

  constructor(credentials: Record<string, string>) {
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

const credentialsFields = [
  { name: 'username', isRequired: true },
  { name: 'password', isRequired: true },
];

registry.register({
  id: 'snowflake',
  name: 'Snowflake',
  credentialsFields,
  factory: (credentials: Record<string, string>) =>
    new SnowflakeDataSource(credentials),
});
