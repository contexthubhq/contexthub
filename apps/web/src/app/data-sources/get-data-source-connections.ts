'use server';

import { getDataSourceConnectionsList } from '@contexthub/data-sources-connections';

export async function getDataSourceConnections(): Promise<
  { id: string; type: string }[]
> {
  return await getDataSourceConnectionsList();
}
