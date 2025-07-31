import dotenv from 'dotenv';
import express, { type Request, type Response } from 'express';

import { mcpRouter } from './mcp/mcp-router.js';
import { authMetadataRouter } from './auth/auth-metadata-router.js';
import { authMiddleware } from './auth/auth-middleware.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

const app = express();

// Authentication metadata endpoints. Mount in the root.
app.use(authMetadataRouter);

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
