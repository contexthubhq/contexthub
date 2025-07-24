import pkg from 'snowflake-sdk';
const { configure, createConnection } = pkg;

import {
  type DataSource,
  type QueryResult,
  registry,
} from '@contexthub/data-sources-common';

import {
  snowflakeCredentialsSchema,
  type SnowflakeCredentials,
} from './types.js';

export class SnowflakeDataSource implements DataSource {
  private readonly credentials: SnowflakeCredentials;

  constructor({ credentials }: { credentials: Record<string, string> }) {
    configure({
      logFilePath: 'STDOUT',
    });
    this.credentials = snowflakeCredentialsSchema.parse(credentials);
  }

  async testConnection() {
    const results = await this.executeQuery('SELECT 1');
    return results.rows.length > 0;
  }

  async executeQuery(query: string): Promise<QueryResult> {
    const connection = createConnection(this.credentials);
    await new Promise<void>((resolve, reject) => {
      connection.connect((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    const results = await new Promise<QueryResult>((resolve, reject) => {
      connection.execute({
        sqlText: query,
        complete: (err, _stmt, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve({ rows: rows ?? [] });
          }
        },
      });
    });
    await new Promise<void>((resolve, reject) => {
      connection.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
    return results;
  }
}

const credentialsFields = [
  { name: 'username', isRequired: true },
  { name: 'password', isRequired: true },
];

registry.register({
  type: 'snowflake',
  name: 'Snowflake',
  credentialsFields,
  factory: ({ credentials }: { credentials: Record<string, string> }) =>
    new SnowflakeDataSource({ credentials }),
});
