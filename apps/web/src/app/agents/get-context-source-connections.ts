'use server';

import {
  ContextSourceConnection,
  getContextSourceConnectionsList,
} from '@contexthub/context-sources-connections';

/**
 * Server function to get saved context source connections for the user.
 */
export async function getContextSourceConnections(): Promise<
  ContextSourceConnection[]
> {
  return await getContextSourceConnectionsList();
}
