import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListTables } from './register-list-tables.js';

export function registerTools(server: McpServer) {
  console.log('🚀 Registering ContextHub tools for the MCP server...');

  registerListTables(server);

  console.log('✅ ContextHub tools registered successfully');
}
