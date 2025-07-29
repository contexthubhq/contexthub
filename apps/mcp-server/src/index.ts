import dotenv from 'dotenv';
import cors from 'cors';
import express, { type Request, type Response } from 'express';

import { mcpRouter } from './mcp/mcp-router.js';
import { authRouter } from './auth/auth-router.js';

dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();
app.use(express.json());
app.use(
  cors({
    origin: '*',
  })
);

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

app.use(authRouter);
app.use('/mcp', mcpRouter);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ContextHub MCP Server listening on port ${PORT}`);
});
