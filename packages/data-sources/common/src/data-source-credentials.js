import { z } from 'zod';
// Base schema for all credentials
const baseCredentialsSchema = z.object({
    type: z.string(),
});
// Snowflake credentials schema
export const snowflakeCredentialsSchema = baseCredentialsSchema.extend({
    type: z.literal('snowflake'),
    username: z.string().describe('Snowflake username'),
    password: z.string().describe('Snowflake password'),
    account: z.string().describe('Snowflake account identifier'),
    warehouse: z.string().describe('Snowflake warehouse'),
    database: z.string().describe('Snowflake database'),
    schema: z.string().optional().describe('Snowflake schema (optional)'),
    role: z.string().optional().describe('Snowflake role (optional)'),
});
// BigQuery credentials schema
export const bigQueryCredentialsSchema = baseCredentialsSchema.extend({
    type: z.literal('bigquery'),
    projectId: z.string().describe('Google Cloud Project ID'),
    // Service account key as JSON string
    serviceAccountKey: z.string().describe('Service account key JSON'),
    // Alternative: using application default credentials
    useApplicationDefaultCredentials: z
        .boolean()
        .optional()
        .describe('Use Application Default Credentials'),
    dataset: z.string().optional().describe('Default dataset (optional)'),
    location: z
        .string()
        .optional()
        .describe('BigQuery location/region (optional)'),
});
// PostgreSQL credentials schema (since I saw it mentioned in the registry)
export const postgresCredentialsSchema = baseCredentialsSchema.extend({
    type: z.literal('postgres'),
    host: z.string().describe('PostgreSQL host'),
    port: z.number().default(5432).describe('PostgreSQL port'),
    username: z.string().describe('PostgreSQL username'),
    password: z.string().describe('PostgreSQL password'),
    database: z.string().describe('PostgreSQL database name'),
    ssl: z.boolean().optional().describe('Enable SSL connection'),
});
// MySQL credentials schema
export const mysqlCredentialsSchema = baseCredentialsSchema.extend({
    type: z.literal('mysql'),
    host: z.string().describe('MySQL host'),
    port: z.number().default(3306).describe('MySQL port'),
    username: z.string().describe('MySQL username'),
    password: z.string().describe('MySQL password'),
    database: z.string().describe('MySQL database name'),
    ssl: z.boolean().optional().describe('Enable SSL connection'),
});
// Discriminated union of all credential types
export const dataSourceCredentialsSchema = z.discriminatedUnion('type', [
    snowflakeCredentialsSchema,
    bigQueryCredentialsSchema,
    postgresCredentialsSchema,
    mysqlCredentialsSchema,
]);
// Type guard functions for convenience
export const isSnowflakeCredentials = (credentials) => {
    return credentials.type === 'snowflake';
};
export const isBigQueryCredentials = (credentials) => {
    return credentials.type === 'bigquery';
};
export const isPostgresCredentials = (credentials) => {
    return credentials.type === 'postgres';
};
export const isMySQLCredentials = (credentials) => {
    return credentials.type === 'mysql';
};
// Helper function to validate credentials based on type
export const validateCredentials = (type, credentials) => {
    const withType = { ...credentials, type };
    return dataSourceCredentialsSchema.parse(withType);
};
