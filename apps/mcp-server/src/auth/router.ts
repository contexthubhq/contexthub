import { Router } from 'express';
import {
  OAuthMetadata,
  OAuthProtectedResourceMetadata,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { metadataHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/metadata.js';
import { AuthConfig } from './config.js';

/**
 * Creates an Express router that serves the OAuth 2.0 metadata endpoints.
 *
 * If authentication is disabled, the router is a no-op.
 *
 * @param authConfig - The authentication configuration.
 * @returns An Express router that serves the authentication metadata endpoints.
 */
export function createAuthMetadataRouter({
  authConfig,
}: {
  authConfig: AuthConfig;
}): Router {
  const authMetadataRouter: Router = Router();

  if (authConfig.AUTH_ENABLED) {
    const oauthMetadata: OAuthMetadata = {
      issuer: authConfig.ISSUER_URL,
      authorization_endpoint: authConfig.AUTHORIZATION_URL,
      token_endpoint: authConfig.TOKEN_URL,
      registration_endpoint: authConfig.REGISTRATION_URL,
      response_types_supported: ['code'],
      scopes_supported: authConfig.SCOPES,
    };

    const oauthProtectedResourceMetadata: OAuthProtectedResourceMetadata = {
      resource: authConfig.MCP_SERVER_HOST,
      // Note that we deliberately have the resource server here as the authorization server.
      // This is because some authorization servers have non-standard endpoint URLs (for example, Okta's), which
      // makes the client (Claude) unable to find the authorization server metadata endpoint.
      // Doing this allows us to control the metadata ourselves so that we can comply with what Claude and other
      // clients expect.
      authorization_servers: [authConfig.MCP_SERVER_HOST],
      bearer_methods_supported: ['header'],
      resource_name: 'MCP Server',
      scopes_supported: authConfig.SCOPES,
    };

    authMetadataRouter.use(
      '/.well-known/oauth-protected-resource',
      metadataHandler(oauthProtectedResourceMetadata)
    );

    // Note that it is non-standard to serve the authorization server metadata from the resource server as we do here.
    // This is done because some authorization servers have non-standard endpoint URLs (for example, Okta's), which
    // makes the client (Claude) unable to find the authorization server metadata endpoint.
    authMetadataRouter.use(
      '/.well-known/oauth-authorization-server',
      metadataHandler(oauthMetadata)
    );
  }

  return authMetadataRouter;
}
