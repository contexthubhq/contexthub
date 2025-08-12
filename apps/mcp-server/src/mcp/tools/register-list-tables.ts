import { z } from 'zod';

import {
  getDataSourceConnection,
  getSelectedTables,
} from '@contexthub/data-sources-connections';
import { registry } from '@contexthub/data-sources-all';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { getContextRepository } from '@contexthub/context-repository';
import type { TableContext } from '@contexthub/core';

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
        const [connection, selectedTables] = await Promise.all([
          getDataSourceConnection({
            id: dataSourceId,
          }),
          getSelectedTables({
            connectionId: dataSourceId,
          }),
        ]);
        const dataSource = registry.createInstance({
          type: connection.type,
          credentials: connection.credentials,
        });
        const selectedTablesSet = new Set(
          selectedTables.map((table) => table.fullyQualifiedName)
        );
        const tableDefinitions = await dataSource.getTablesList();
        const filteredTableDefinitions = tableDefinitions.filter((table) =>
          selectedTablesSet.has(table.fullyQualifiedTableName)
        );
        const repository = getContextRepository();
        const workingCopy = await repository.checkout({
          branchName: repository.mainBranchName,
        });
        const tableContexts = await workingCopy.listTables();
        const tableContextMap = new Map<string, TableContext>();
        for (const tableContext of tableContexts) {
          if (tableContext.dataSourceConnectionId !== dataSourceId) {
            continue;
          }
          tableContextMap.set(
            tableContext.fullyQualifiedTableName,
            tableContext
          );
        }
        const tables = filteredTableDefinitions.map((tableDefinition) => {
          const tableContext = tableContextMap.get(
            tableDefinition.fullyQualifiedTableName
          );
          return {
            ...tableDefinition,
            ...tableContext,
          };
        });

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
