import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerListTables } from './register-list-tables.js';
import { registerListDataSources } from './register-list-data-source-connections.js';
import { registerListColumns } from './register-list-columns.js';
import { registerExecuteQuery } from './register-execute-query.js';
import { registerListMetrics } from './register-list-metrics.js';
import { registerListConcepts } from './register-list-concepts.js';

export function registerTools(server: McpServer) {
  console.log('🚀 Registering ContextHub tools for the MCP server...');

  registerListDataSources(server);
  registerListTables(server);
  registerListColumns(server);
  registerListMetrics(server);
  registerListConcepts(server);
  registerExecuteQuery(server);

  console.log('✅ ContextHub tools registered successfully');
}
