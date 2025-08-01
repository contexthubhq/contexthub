import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListTables } from './register-list-tables.js';
import { registerListDataSources } from './register-list-data-sources.js';
import { registerListColumns } from './register-list-columns.js';

export function registerTools(server: McpServer) {
  console.log('🚀 Registering ContextHub tools for the MCP server...');

  registerListDataSources(server);
  registerListTables(server);
  registerListColumns(server);

  console.log('✅ ContextHub tools registered successfully');
}
