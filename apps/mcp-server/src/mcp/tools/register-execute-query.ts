import { z } from 'zod';

import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { registry } from '@contexthub/data-sources-all';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export function registerExecuteQuery(server: McpServer) {
  server.registerTool(
    'execute-query',
    {
      title: 'Execute query',
      description:
        'Execute a query against a given data source and return the results.',
      inputSchema: {
        dataSourceConnectionId: z.string(),
        query: z
          .string()
          .describe(
            'The query to execute. The query should be in the data source specific query language. The query should be a valid query for the data source.'
          ),
      },
    },
    async ({ dataSourceConnectionId, query }): Promise<CallToolResult> => {
      console.log(
        `🔧 [execute-query] Tool called. dataSourceConnectionId: ${dataSourceConnectionId}, query: ${query}`
      );
      try {
        const connection = await getDataSourceConnection({
          id: dataSourceConnectionId,
        });
        const dataSource = registry.createInstance({
          type: connection.type,
          credentials: connection.credentials,
        });
        const results = await dataSource.executeQuery(query);
        console.log('✅ [execute-query] Success.');
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(results),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [execute-query] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error executing query: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
