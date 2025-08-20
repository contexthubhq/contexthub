import { z } from 'zod';

import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { registry } from '@contexthub/data-sources-all';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { ColumnContext } from '@contexthub/core';
import { getContextRepository } from '@contexthub/context-repository/server';

export function registerListColumns(server: McpServer) {
  server.registerTool(
    'list-columns',
    {
      title: 'List columns',
      description: 'List all columns for a given table.',
      inputSchema: {
        dataSourceConnectionId: z.string(),
        fullyQualifiedTableName: z.string(),
      },
    },
    async ({
      dataSourceConnectionId,
      fullyQualifiedTableName,
    }): Promise<CallToolResult> => {
      console.log(
        `🔧 [list-columns] Tool called. dataSourceConnectionId: ${dataSourceConnectionId}, fullyQualifiedTableName: ${fullyQualifiedTableName}`
      );
      try {
        const connection = await getDataSourceConnection({
          id: dataSourceConnectionId,
        });
        const dataSource = registry.createInstance({
          type: connection.type,
          credentials: connection.credentials,
        });
        const columnDefinitions = await dataSource.getColumnsList({
          fullyQualifiedTableName,
        });
        const repository = getContextRepository();
        const workingCopy = await repository.checkout({
          branchName: repository.mainBranchName,
        });
        const columnContexts = await workingCopy.listColumns();
        const columnContextMap = new Map<string, ColumnContext>();
        for (const columnContext of columnContexts) {
          if (columnContext.dataSourceConnectionId !== dataSourceConnectionId) {
            continue;
          }
          if (
            columnContext.fullyQualifiedTableName !== fullyQualifiedTableName
          ) {
            continue;
          }
          columnContextMap.set(columnContext.columnName, columnContext);
        }
        const columns = columnDefinitions.map((columnDefinition) => {
          const columnContext = columnContextMap.get(
            columnDefinition.columnName
          );
          return {
            ...columnDefinition,
            dataSourceConnectionId,
            ...columnContext,
          };
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
