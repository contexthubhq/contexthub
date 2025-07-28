import express, { type Request, type Response } from 'express';

import dotenv from 'dotenv';
import { mcpRouter } from './mcp/mcp-router.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use('/mcp', mcpRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ContextHub MCP Server listening on port ${PORT}`);
});
