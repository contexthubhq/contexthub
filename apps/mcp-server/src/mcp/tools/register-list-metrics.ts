import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getContextRepository } from '@contexthub/context-repository';

export function registerListMetrics(server: McpServer) {
  server.registerTool(
    'list-metrics',
    {
      title: 'List metrics',
      description: 'List all metrics available.',
    },
    async () => {
      console.log(`🔧 [list-metrics] Tool called.`);
      try {
        const repository = getContextRepository();
        const workingCopy = await repository.checkout({
          branchName: repository.mainBranchName,
        });
        const metrics = await workingCopy.listMetrics();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(metrics),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [list-metrics] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching metrics: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
