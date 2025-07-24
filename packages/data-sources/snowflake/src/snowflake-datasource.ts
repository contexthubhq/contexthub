import { type DataSource } from '@contexthub/data-sources-common';
import {
  snowflakeCredentialsSchema,
  type SnowflakeCredentials,
} from './snowflake-credentials.js';

export class SnowflakeDataSource implements DataSource {
  id = 'snowflake';
  name = 'Snowflake';

  private credentials: SnowflakeCredentials;

  constructor(credentials: SnowflakeCredentials) {
    this.credentials = credentials;
  }

  async testConnection() {
    return true;
  }
}
