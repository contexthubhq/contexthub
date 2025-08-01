import { z } from 'zod';

import { getDataSourceCredentials } from '@contexthub/data-sources-credentials';
import { registry } from '@contexthub/data-sources-all';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function registerListColumns(server: McpServer) {
  server.registerTool(
    'list-columns',
    {
      title: 'List columns',
      description: 'List all columns for a given table.',
      inputSchema: {
        dataSourceId: z.string(),
        fullyQualifiedTableName: z.string(),
      },
    },
    async ({
      dataSourceId,
      fullyQualifiedTableName,
    }): Promise<CallToolResult> => {
      console.log(
        `🔧 [get-table] Tool called. dataSourceId: ${dataSourceId}, fullyQualifiedTableName: ${fullyQualifiedTableName}`
      );
      try {
        const credentials = await getDataSourceCredentials({
          dataSourceId,
        });
        const dataSource = registry.createInstance({
          type: credentials.type,
          credentials: credentials.credentials,
        });
        const columns = await dataSource.getColumnsList({
          fullyQualifiedTableName,
        });
        console.log(
          '✅ [list-columns] Success, response length:',
          columns.length
        );
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(columns),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [list-columns] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching columns: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
