import { z } from 'zod';

import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { registry } from '@contexthub/data-sources-all';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function registerListTables(server: McpServer) {
  server.registerTool(
    'list-tables',
    {
      title: 'List tables',
      description: 'List all tables for a given data source.',
      inputSchema: {
        dataSourceId: z.string(),
      },
    },
    async ({ dataSourceId }): Promise<CallToolResult> => {
      console.log(
        `🔧 [list-tables] Tool called. dataSourceId: ${dataSourceId}`
      );
      try {
        const connection = await getDataSourceConnection({
          id: dataSourceId,
        });
        const dataSource = registry.createInstance({
          type: connection.type,
          credentials: connection.credentials,
        });
        const tables = await dataSource.getTablesList();
        console.log(
          '✅ [list-tables] Success, response length:',
          tables.length
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(tables),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [list-tables] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching tables: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
