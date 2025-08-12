import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getContextRepository } from '@contexthub/context-repository';

export function registerListConcepts(server: McpServer) {
  server.registerTool(
    'list-concepts',
    {
      title: 'List concepts',
      description: 'List all concepts available.',
    },
    async () => {
      console.log(`🔧 [list-concepts] Tool called.`);
      try {
        const repository = getContextRepository();
        const workingCopy = await repository.checkout({
          branchName: repository.mainBranchName,
        });
        const concepts = await workingCopy.listConcepts();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(concepts),
            },
          ],
        };
      } catch (error) {
        console.log(
          '❌ [list-concepts] Error:',
          error instanceof Error ? error.message : 'Unknown error'
        );
        return {
          content: [
            {
              type: 'text',
              text: `Error fetching concepts: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`,
            },
          ],
        };
      }
    }
  );
}
