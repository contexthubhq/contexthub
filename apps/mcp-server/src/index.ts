import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

import { mcpRouter } from './mcp/mcp-router.js';
import { createAuthMetadataRouter } from './auth/router.js';
import { createAuthMiddleware } from './auth/middleware.js';
import { getAuthConfig } from './auth/config.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

const authConfig = getAuthConfig();
const authMetadataRouter = createAuthMetadataRouter({ authConfig });
const authMiddleware = createAuthMiddleware({ authConfig });

// Authentication metadata endpoints. Mount in the root.
app.use(authMetadataRouter);

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

app.use('/mcp', authMiddleware, mcpRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ContextHub MCP Server listening on port ${PORT}`);
});
