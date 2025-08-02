import {
  type TablesQueryResult,
  tablesQueryResultSchema,
} from '@/types/tables-query-result';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TABLES_QUERY_KEY } from './query-keys';

async function getTables({
  dataSourceConnectionId,
}: {
  dataSourceConnectionId: string;
}): Promise<TablesQueryResult> {
  const response = await fetch(`/api/tables/${dataSourceConnectionId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw Error('Failed to fetch tables.');
  }

  return tablesQueryResultSchema.parse(data);
}

export function useTablesQuery({
  dataSourceConnectionId,
}: {
  dataSourceConnectionId: string;
}): UseQueryResult<TablesQueryResult, Error> {
  return useQuery({
    queryKey: [TABLES_QUERY_KEY, dataSourceConnectionId],
    queryFn: () => getTables({ dataSourceConnectionId }),
  });
}
