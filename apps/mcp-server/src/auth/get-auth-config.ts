import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const authConfigEnvironmentSchema = z.object({
  AUTHORIZATION_SERVER: z.string(),
  MCP_SERVER_HOST: z.string(),
});

export type AuthConfig = {
  authorizationServer: string;
  mcpServerHost: string;
};

export function getAuthConfig(): AuthConfig | null {
  if (process.env.AUTH_ENABLED === 'true') {
    const parsed = authConfigEnvironmentSchema.parse(process.env);
    return {
      authorizationServer: parsed.AUTHORIZATION_SERVER,
      mcpServerHost: parsed.MCP_SERVER_HOST,
    };
  }

  return null;
}
