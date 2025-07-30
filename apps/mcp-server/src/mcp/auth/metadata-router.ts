import { Router } from 'express';
import {
  OAuthMetadata,
  OAuthProtectedResourceMetadata,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { metadataHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/metadata.js';
import { authConfig } from './auth-config.js';

const metadataRouter: Router = Router();

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
    authorization_servers: [authConfig.MCP_SERVER_HOST],
    bearer_methods_supported: ['header'],
    resource_name: 'MCP Server',
    scopes_supported: authConfig.SCOPES,
  };

  metadataRouter.use(
    '/.well-known/oauth-protected-resource',
    metadataHandler(oauthProtectedResourceMetadata)
  );

  metadataRouter.use(
    '/.well-known/oauth-authorization-server',
    metadataHandler(oauthMetadata)
  );
}

export { metadataRouter };
