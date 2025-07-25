import { z } from 'zod';

export const snowflakeCredentialsSchema = z.object({
  account: z.string(),
  username: z.string(),
  password: z.string(),
  warehouse: z.string(),
  role: z.string(),
});

export type SnowflakeCredentials = z.infer<typeof snowflakeCredentialsSchema>;
