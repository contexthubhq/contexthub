import pkg from 'snowflake-sdk';
const { configure, createConnection } = pkg;
import { z } from 'zod';

import {
  type DataSource,
  type QueryResult,
  registry,
} from '@contexthub/data-sources-common';

import {
  snowflakeCredentialsSchema,
  type SnowflakeCredentials,
} from './types.js';
import type { TableSystemMetadata } from '@contexthub/core';

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
    try {
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
      return results;
    } finally {
      await new Promise<void>((resolve, reject) => {
        connection.destroy((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
  }

  async getTablesList(): Promise<TableSystemMetadata[]> {
    const query = `
    SELECT 
      TABLE_CATALOG,
      TABLE_SCHEMA,
      TABLE_NAME,
      TABLE_TYPE,
    FROM information_schema.tables 
    WHERE TABLE_CATALOG = '${this.credentials.database}'
    ORDER BY TABLE_NAME
  `;
    const schema = z.array(
      z.object({
        TABLE_CATALOG: z.string(),
        TABLE_SCHEMA: z.string(),
        TABLE_NAME: z.string(),
        TABLE_TYPE: z.string(),
      })
    );
    const results = await this.executeQuery(query);
    const parsedRows = schema.parse(results.rows);
    return parsedRows.map((row) => ({
      tableName: row.TABLE_NAME,
      tableSchema: row.TABLE_SCHEMA,
      tableCatalog: row.TABLE_CATALOG,
      tableType: row.TABLE_TYPE,
      fullyQualifiedTableName: `${row.TABLE_CATALOG}.${row.TABLE_SCHEMA}.${row.TABLE_NAME}`,
    }));
  }
}

const credentialsFields = [
  { name: 'account', isRequired: true },
  { name: 'username', isRequired: true },
  { name: 'password', isRequired: true },
  { name: 'database', isRequired: true },
  { name: 'warehouse', isRequired: true },
  { name: 'role', isRequired: true },
];

registry.register({
  type: 'snowflake',
  name: 'Snowflake',
  credentialsFields,
  factory: ({ credentials }: { credentials: Record<string, string> }) =>
    new SnowflakeDataSource({ credentials }),
});
