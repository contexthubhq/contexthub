import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const authConfigDisabledEnvironmentSchema = z.object({
  AUTH_ENABLED: z.literal('false').transform(() => false as const),
});

const authConfigEnabledEnvironmentSchema = z.object({
  AUTH_ENABLED: z.literal('true').transform(() => true as const),
  MCP_SERVER_HOST: z.string(),
  ISSUER_URL: z.string(),
  AUTHORIZATION_URL: z.string(),
  TOKEN_URL: z.string(),
  REGISTRATION_URL: z.string(),
  JWKS_URL: z.string(),
  AUDIENCE: z.string(),
  SCOPES: z.string().transform((scopes) => scopes.split(',')),
});

const authConfigSchema = z.discriminatedUnion('AUTH_ENABLED', [
  authConfigDisabledEnvironmentSchema,
  authConfigEnabledEnvironmentSchema,
]);

export type AuthConfig = z.infer<typeof authConfigSchema>;

export const authConfig: AuthConfig = authConfigSchema.parse(process.env);
