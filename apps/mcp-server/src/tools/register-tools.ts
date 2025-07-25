import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { listTables } from './list-tables.js';

export function registerTools(server: McpServer) {
  console.log('🚀 Registering ContextHub tools for the MCP server...');

  server.tool(
    'list-tables',
    {
      description: 'List all tables available to the user in their warehouses',
    },
    listTables
  );

  console.log('✅ ContextHub tools registered successfully');
}
