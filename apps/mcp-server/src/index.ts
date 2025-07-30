import express, { NextFunction, type Request, type Response } from 'express';

import dotenv from 'dotenv';
import { mcpRouter } from './mcp/mcp-router.js';
import { mcpAuthMetadataRouter } from '@modelcontextprotocol/sdk/server/auth/router.js';
import {
  OAuthMetadata,
  OAuthProtectedResourceMetadata,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { metadataHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/metadata.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { OAuthTokenVerifier } from '@modelcontextprotocol/sdk/server/auth/provider.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

const oauthMetadata: OAuthMetadata = {
  issuer: process.env.ISSUER_URL!,
  authorization_endpoint: process.env.AUTHORIZATION_URL!,
  token_endpoint: process.env.TOKEN_URL!,
  registration_endpoint: process.env.REGISTRATION_URL!,
  response_types_supported: ['code'],
};

const oauthProtectedResourceMetadata: OAuthProtectedResourceMetadata = {
  resource: process.env.MCP_SERVER_HOST!,
  authorization_servers: [process.env.MCP_SERVER_HOST!],
  bearer_methods_supported: ['header'],
  resource_name: 'MCP Server',
};

app.use(
  '/.well-known/oauth-protected-resource',
  metadataHandler(oauthProtectedResourceMetadata)
);

app.use(
  '/.well-known/oauth-authorization-server',
  metadataHandler(oauthMetadata)
);

const verifier: OAuthTokenVerifier = {
  verifyAccessToken: async (token: string) => {
    console.log('verifyAccessToken', token);
    return {
      token,
      scopes: ['claudeai'],
      clientId: process.env.CLIENT_ID!,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).getTime(),
    };
  },
};

const authMiddleware = requireBearerAuth({
  verifier,
  requiredScopes: ['claudeai'],
  resourceMetadataUrl: new URL(
    '/.well-known/oauth-protected-resource',
    process.env.MCP_SERVER_HOST!
  ).toString(),
});

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/mcp', authMiddleware, mcpRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ContextHub MCP Server listening on port ${PORT}`);
});
