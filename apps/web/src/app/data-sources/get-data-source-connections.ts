'use server';

import { getDataSourceConnectionsList } from '@contexthub/data-sources-connections';

export async function getDataSourceConnections(): Promise<
  { id: string; type: string; name: string }[]
> {
  return await getDataSourceConnectionsList();
}
