import { type DataSource } from '@contexthub/data-sources-common';
import { type SnowflakeCredentials } from './snowflake-credentials.js';
export declare class SnowflakeDataSource implements DataSource {
    id: string;
    name: string;
    private credentials;
    constructor(credentials: SnowflakeCredentials);
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=snowflake-datasource.d.ts.map