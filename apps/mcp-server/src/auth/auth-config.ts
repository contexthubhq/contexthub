import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const authConfigDisabledEnvironmentSchema = z.object({
  /**
   * If AUTH_ENABLED is false, the MCP server will not require authentication nor it will
   * expose any authentication metadata endpoints.
   */
  AUTH_ENABLED: z.literal('false').transform(() => false as const),
});

/**
 * Configures authentication for the MCP server.
 *
 * Example:
 *
 * ```
 * AUTH_ENABLED=true
 * MCP_SERVER_HOST=https://mcp-server.example.com
 * ISSUER_URL=https://<your-okta-domain>.okta.com/oauth2/<your-auth-server-id>
 * AUTHORIZATION_URL=https://<your-okta-domain>.okta.com/oauth2/<your-auth-server-id>/v1/authorize
 * TOKEN_URL=https://<your-okta-domain>.okta.com/oauth2/<your-auth-server-id>/v1/token
 * REGISTRATION_URL=https://<your-okta-domain>.okta.com/oauth2/<your-auth-server-id>/v1/clients
 * JWKS_URL=https://<your-okta-domain>.okta.com/oauth2/<your-auth-server-id>/v1/keys
 * AUDIENCE=mcp-server.example.com
 * SCOPES=mcp:tools
 * ```
 */
const authConfigEnabledEnvironmentSchema = z.object({
  /**
   * If AUTH_ENABLED is true, the MCP server will require authentication and it will
   * expose authentication metadata endpoints.
   */
  AUTH_ENABLED: z.literal('true').transform(() => true as const),
  /**
   * The host of the MCP server (this application).
   */
  MCP_SERVER_HOST: z.string(),
  /**
   * The authorization server's issuer identifier
   */
  ISSUER_URL: z.string(),
  /**
   * URL of the authorization server's authorization endpoint.
   */
  AUTHORIZATION_URL: z.string(),
  /**
   * URL of the authorization server's token endpoint
   */
  TOKEN_URL: z.string(),
  /**
   * URL of the authorization server's OAuth 2.0 Dynamic Client Registration endpoint. Optional.
   */
  REGISTRATION_URL: z.string().optional(),
  /**
   * URL of the authorization server's JWK Set [JWK] document.
   */
  JWKS_URL: z.string(),
  /**
   * The OAuth audience. The authentication middleware will verify that the access token's audience
   * matches this value.
   */
  AUDIENCE: z.string(),
  /**
   * The OAuth scopes. The authentication middleware will verify that the access token's scopes
   * match this value.
   */
  SCOPES: z.string().transform((scopes) => scopes.split(',')),
});

const authConfigSchema = z.discriminatedUnion('AUTH_ENABLED', [
  authConfigDisabledEnvironmentSchema,
  authConfigEnabledEnvironmentSchema,
]);

export type AuthConfig = z.infer<typeof authConfigSchema>;

export const authConfig: AuthConfig = authConfigSchema.parse(process.env);
