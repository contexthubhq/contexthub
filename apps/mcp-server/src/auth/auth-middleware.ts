import { z } from 'zod';
import type { NextFunction, Request, Response, RequestHandler } from 'express';
import { jwtVerify, createRemoteJWKSet } from 'jose';
import { requireBearerAuth } from '@modelcontextprotocol/sdk/server/auth/middleware/bearerAuth.js';
import { OAuthTokenVerifier } from '@modelcontextprotocol/sdk/server/auth/provider.js';
import { authConfig } from './auth-config.js';

let authMiddleware: RequestHandler;

if (authConfig.AUTH_ENABLED) {
  const JWKS = createRemoteJWKSet(new URL(authConfig.JWKS_URL));

  const jwtSchema = z.object({
    cid: z.string(),
    exp: z.number(),
    scp: z.array(z.string()),
  });

  async function verifyAccessToken(token: string) {
    if (!authConfig.AUTH_ENABLED) {
      throw new Error('Authentication is disabled');
    }

    const { payload } = await jwtVerify(token, JWKS, {
      issuer: authConfig.ISSUER_URL,
      audience: authConfig.AUDIENCE,
      algorithms: ['RS256'],
    });
    const parsed = jwtSchema.parse(payload);
    return {
      token,
      clientId: parsed.cid,
      expiresAt: parsed.exp,
      scopes: parsed.scp,
    };
  }

  const verifier: OAuthTokenVerifier = {
    verifyAccessToken,
  };

  authMiddleware = requireBearerAuth({
    verifier,
    requiredScopes: authConfig.SCOPES,
    resourceMetadataUrl: new URL(
      '/.well-known/oauth-protected-resource',
      authConfig.MCP_SERVER_HOST
    ).toString(),
  });
} else {
  authMiddleware = (_req: Request, _res: Response, next: NextFunction) => {
    next();
  };
}

export { authMiddleware };
