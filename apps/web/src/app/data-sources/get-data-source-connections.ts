'use server';

import {
  DataSourceConnection,
  getDataSourceConnectionsList,
} from '@contexthub/data-sources-connections';

/**
 * Server function to get saved data source connections for the user.
 */
export async function getDataSourceConnections(): Promise<
  DataSourceConnection[]
> {
  return await getDataSourceConnectionsList();
}
