import { z } from 'zod';

export const snowflakeCredentialsSchema = z.object({
  username: z.string().describe('Snowflake username'),
  password: z.string().describe('Snowflake password'),
  database: z.string().describe('Snowflake database'),
});

export type SnowflakeCredentials = z.infer<typeof snowflakeCredentialsSchema>;
