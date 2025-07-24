import { z } from 'zod';
export declare const snowflakeCredentialsSchema: z.ZodObject<{
    type: z.ZodLiteral<"snowflake">;
    username: z.ZodString;
    password: z.ZodString;
    account: z.ZodString;
    warehouse: z.ZodString;
    database: z.ZodString;
    schema: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const bigQueryCredentialsSchema: z.ZodObject<{
    type: z.ZodLiteral<"bigquery">;
    projectId: z.ZodString;
    serviceAccountKey: z.ZodString;
    useApplicationDefaultCredentials: z.ZodOptional<z.ZodBoolean>;
    dataset: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const postgresCredentialsSchema: z.ZodObject<{
    type: z.ZodLiteral<"postgres">;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const mysqlCredentialsSchema: z.ZodObject<{
    type: z.ZodLiteral<"mysql">;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const dataSourceCredentialsSchema: z.ZodDiscriminatedUnion<[z.ZodObject<{
    type: z.ZodLiteral<"snowflake">;
    username: z.ZodString;
    password: z.ZodString;
    account: z.ZodString;
    warehouse: z.ZodString;
    database: z.ZodString;
    schema: z.ZodOptional<z.ZodString>;
    role: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"bigquery">;
    projectId: z.ZodString;
    serviceAccountKey: z.ZodString;
    useApplicationDefaultCredentials: z.ZodOptional<z.ZodBoolean>;
    dataset: z.ZodOptional<z.ZodString>;
    location: z.ZodOptional<z.ZodString>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"postgres">;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>, z.ZodObject<{
    type: z.ZodLiteral<"mysql">;
    host: z.ZodString;
    port: z.ZodDefault<z.ZodNumber>;
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
    ssl: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>]>;
export type SnowflakeCredentials = z.infer<typeof snowflakeCredentialsSchema>;
export type BigQueryCredentials = z.infer<typeof bigQueryCredentialsSchema>;
export type PostgresCredentials = z.infer<typeof postgresCredentialsSchema>;
export type MySQLCredentials = z.infer<typeof mysqlCredentialsSchema>;
export type DataSourceCredentials = z.infer<typeof dataSourceCredentialsSchema>;
export declare const isSnowflakeCredentials: (credentials: DataSourceCredentials) => credentials is SnowflakeCredentials;
export declare const isBigQueryCredentials: (credentials: DataSourceCredentials) => credentials is BigQueryCredentials;
export declare const isPostgresCredentials: (credentials: DataSourceCredentials) => credentials is PostgresCredentials;
export declare const isMySQLCredentials: (credentials: DataSourceCredentials) => credentials is MySQLCredentials;
export declare const validateCredentials: (type: string, credentials: Record<string, unknown>) => DataSourceCredentials;
//# sourceMappingURL=data-source-credentials.d.ts.map