import { z } from 'zod';
export declare const snowflakeCredentialsSchema: z.ZodObject<{
    username: z.ZodString;
    password: z.ZodString;
    database: z.ZodString;
}, z.core.$strip>;
export type SnowflakeCredentials = z.infer<typeof snowflakeCredentialsSchema>;
//# sourceMappingURL=snowflake-credentials.d.ts.map