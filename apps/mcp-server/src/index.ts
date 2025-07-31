import express, { type Request, type Response } from 'express';

import dotenv from 'dotenv';
import { mcpRouter } from './mcp/mcp-router.js';
import { metadataRouter } from './auth/metadata-router.js';
import { authMiddleware } from './auth/auth-middleware.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

app.use(metadataRouter);

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
