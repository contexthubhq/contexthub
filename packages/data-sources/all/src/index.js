import { SnowflakeDataSource, snowflakeCredentialsSchema, } from '@contexthub/data-sources-snowflake';
import { registry } from './registry.js';
registry.register({
    id: 'snowflake',
    name: 'Snowflake',
    description: 'Snowflake data source',
    credentialsSchema: snowflakeCredentialsSchema,
    factory: (credentials) => new SnowflakeDataSource(credentials),
});
export { registry } from './registry.js';
