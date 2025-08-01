import { getDataSourceConnectionsList } from '@contexthub/data-sources-connections';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function registerListDataSources(server: McpServer) {
  server.registerTool(
    'list-data-sources',
    {
      title: 'List data sources',
      description: 'List all data sources available.',
    },
    async () => {
      console.log(`🔧 [list-data-sources] Tool called.`);
      try {
        const connections = await getDataSourceConnectionsList();
        const returnValue = connections.map((connection) => {
          return {
            id: connection.id,
            type: connection.type,
            name: connection.name,
          };
        });
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(returnValue),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [list-data-sources] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching data sources: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
