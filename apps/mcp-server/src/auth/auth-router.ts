import { type Request, type Response, Router } from 'express';
import { getAuthConfig } from './get-auth-config.js';

const authRouter: Router = Router();

const authConfig = getAuthConfig();

if (authConfig !== null) {
  authRouter.get(
    '/.well-known/oauth-protected-resource',
    (_req: Request, res: Response) => {
      console.log(`Metadata request from ${_req.headers.origin}`);
      const metadata = {
        resource: `${authConfig.mcpServerHost}/mcp`,
        authorization_servers: [authConfig.authorizationServer],
        bearer_methods_supported: ['header'],
        resource_name: 'ContextHub MCP Server',
        scopes_supported: ['read:mcp'],
      };
      res.json(metadata);
    }
  );
}

export { authRouter };
