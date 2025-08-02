import {
  type DataSourceConnectionDetails,
  dataSourceConnectionDetailsSchema,
} from '@/types/data-source-connection-details';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { DATA_SOURCE_CONNECTION_QUERY_KEY } from './query-keys';

async function getDataSourceConnection({
  connectionId,
}: {
  connectionId: string;
}): Promise<DataSourceConnectionDetails> {
  const response = await fetch(
    `/api/data-sources/connections/${connectionId}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw Error('Failed to fetch data source connection');
  }

  return dataSourceConnectionDetailsSchema.parse(data);
}

export function useDataSourceConnection({
  connectionId,
}: {
  connectionId: string;
}): UseQueryResult<DataSourceConnectionDetails, Error> {
  return useQuery({
    queryKey: [DATA_SOURCE_CONNECTION_QUERY_KEY, connectionId],
    queryFn: () => getDataSourceConnection({ connectionId }),
  });
}
