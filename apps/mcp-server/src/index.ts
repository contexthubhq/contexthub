import express, { type Request, type Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import { InMemoryEventStore } from '@modelcontextprotocol/sdk/examples/shared/inMemoryEventStore.js';
import { randomUUID } from 'node:crypto';

import dotenv from 'dotenv';
import { registerTools } from './tools/register-tools.js';

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 3001;

// Create Express app
const app = express();

// Create MCP server instance
const getServer = () => {
  const server = new McpServer(
    {
      name: 'ContextHub MCP Server',
      version: '1.0.0',
    },
    {
      capabilities: {
        logging: {},
        notifications: {},
      },
    }
  );

  // Register ContextHub tools
  registerTools(server);

  return server;
};

// Health check endpoint
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

const transports: Map<string, StreamableHTTPServerTransport> = new Map<
  string,
  StreamableHTTPServerTransport
>();

app.post('/mcp', async (req: Request, res: Response) => {
  console.error('Received MCP POST request');
  try {
    // Check for existing session ID
    const sessionId = req.headers['mcp-session-id'] as string | undefined;
    let transport: StreamableHTTPServerTransport;

    if (sessionId && transports.has(sessionId)) {
      // Reuse existing transport
      transport = transports.get(sessionId)!;
    } else if (!sessionId) {
      const server = getServer();

      // New initialization request
      const eventStore = new InMemoryEventStore();
      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => randomUUID(),
        eventStore, // Enable resumability
        onsessioninitialized: (sessionId: string) => {
          // Store the transport by session ID when session is initialized
          // This avoids race conditions where requests might come in before the session is stored
          console.error(`Session initialized with ID: ${sessionId}`);
          transports.set(sessionId, transport);
        },
      });

      transport.onclose = () => {
        const sid = transport.sessionId;
        if (sid && transports.has(sid)) {
          console.log(
            `Transport closed for session ${sid}, removing from transports map`
          );
          transports.delete(sid);
        }
      };

      // Connect the transport to the MCP server BEFORE handling the request
      // so responses can flow back through the same transport
      await server.connect(transport);

      await transport.handleRequest(req, res);
      return; // Already handled
    } else {
      // Invalid request - no session ID or not initialization request
      res.status(400).json({
        jsonrpc: '2.0',
        error: {
          code: -32000,
          message: 'Bad Request: No valid session ID provided',
        },
        id: req?.body?.id,
      });
      return;
    }

    // Handle the request with existing transport - no need to reconnect
    // The existing transport is already connected to the server
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error('Error handling MCP request:', error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: '2.0',
        error: {
          code: -32603,
          message: 'Internal server error',
        },
        id: req?.body?.id,
      });
      return;
    }
  }
});

// Reusable handler for GET and DELETE requests
const handleSessionRequest = async (
  req: express.Request,
  res: express.Response
) => {
  const sessionId = req.headers['mcp-session-id'] as string | undefined;
  if (!sessionId || !transports.has(sessionId)) {
    res.status(400).send('Invalid or missing session ID');
    return;
  }

  const transport = transports.get(sessionId)!;
  await transport.handleRequest(req, res);
};

app.get('/mcp', handleSessionRequest);
app.delete('/mcp', handleSessionRequest);

// Start the server
app.listen(PORT, () => {
  console.log(`🚀 ContextHub MCP Server listening on port ${PORT}`);
});

// Handle server shutdown
process.on('SIGINT', async () => {
  console.log('Shutting down server...');
  // Close all active transports to properly clean up resources
  for (const sessionId of transports.keys()) {
    try {
      console.log(`Closing transport for session ${sessionId}`);
      await transports.get(sessionId)!.close();
      transports.delete(sessionId);
    } catch (error) {
      console.error(`Error closing transport for session ${sessionId}:`, error);
    }
  }
  console.log('Server shutdown complete');
  process.exit(0);
});
