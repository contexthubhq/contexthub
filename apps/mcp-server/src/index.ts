import express, { type Request, type Response } from 'express';

import { z } from 'zod';
import dotenv from 'dotenv';
import { mcpRouter } from './mcp/mcp-router.js';
import {
  OAuthMetadata,
  OAuthProtectedResourceMetadata,
} from '@modelcontextprotocol/sdk/shared/auth.js';
import { metadataHandler } from '@modelcontextprotocol/sdk/server/auth/handlers/metadata.js';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { OAuthTokenVerifier } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { jwtVerify, createRemoteJWKSet } from 'jose';

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
  scopes_supported: process.env.SCOPES!.split(','),
};

const oauthProtectedResourceMetadata: OAuthProtectedResourceMetadata = {
  resource: process.env.MCP_SERVER_HOST!,
  authorization_servers: [process.env.MCP_SERVER_HOST!],
  bearer_methods_supported: ['header'],
  resource_name: 'MCP Server',
  scopes_supported: process.env.SCOPES!.split(','),
};

app.use(
  '/.well-known/oauth-protected-resource',
  metadataHandler(oauthProtectedResourceMetadata)
);

app.use(
  '/.well-known/oauth-authorization-server',
  metadataHandler(oauthMetadata)
);

const JWKS = createRemoteJWKSet(new URL(process.env.JWKS_URL!));

const jwtSchema = z.object({
  cid: z.string(),
  exp: z.number(),
  scp: z.array(z.string()),
});

const verifier: OAuthTokenVerifier = {
  verifyAccessToken: async (token: string) => {
    const { payload } = await jwtVerify(token, JWKS, {
      issuer: process.env.ISSUER_URL!,
      audience: process.env.AUDIENCE!,
      algorithms: ['RS256'],
    });
    const parsed = jwtSchema.parse(payload);
    return {
      token,
      clientId: parsed.cid,
      expiresAt: parsed.exp,
      scopes: parsed.scp,
    };
  },
};

const authMiddleware = requireBearerAuth({
  verifier,
  requiredScopes: process.env.SCOPES!.split(','),
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
