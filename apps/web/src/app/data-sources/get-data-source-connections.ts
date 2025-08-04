'use server';

import { getDataSourceConnectionsList } from '@contexthub/data-sources-connections';

/**
 * Server function to get saved data source connections for the user.
 */
export async function getDataSourceConnections(): Promise<
  { id: string; type: string; name: string }[]
> {
  return await getDataSourceConnectionsList();
}
