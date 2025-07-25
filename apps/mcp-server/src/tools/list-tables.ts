import { getDataSourceCredentialsList } from '@contexthub/data-sources-credentials';
import { registry } from '@contexthub/data-sources-all';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';

export async function listTables(): Promise<CallToolResult> {
  console.log('🔧 [list-tables] Tool called.');
  try {
    const credentials = await getDataSourceCredentialsList();
    if (credentials.length === 0) {
      return {
        content: [{ type: 'text', text: 'No data source credentials found' }],
      };
    }
    const firstCredential = credentials[0];
    const dataSource = registry.createInstance({
      type: firstCredential.type,
      credentials: firstCredential.credentials,
    });
    const tables = await dataSource.getTablesList();
    console.log('✅ [list-tables] Success, response length:', tables.length);
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(tables, null, 2),
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
