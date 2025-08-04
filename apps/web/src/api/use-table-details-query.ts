import {
  type TableDetailsQueryResult,
  tableDetailsQueryResultSchema,
} from '@/types/table-details-query-result';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TABLES_QUERY_KEY } from './query-keys';

async function getTable({
  dataSourceConnectionId,
  fullyQualifiedTableName,
}: {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
}): Promise<TableDetailsQueryResult> {
  const encodedFullyQualifiedTableName = encodeURIComponent(
    fullyQualifiedTableName
  );
  const response = await fetch(
    `/api/tables/${dataSourceConnectionId}/${encodedFullyQualifiedTableName}`,
    {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch table details.');
  }

  return tableDetailsQueryResultSchema.parse(data);
}

export function useTableDetailsQuery({
  dataSourceConnectionId,
  fullyQualifiedTableName,
}: {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
}): UseQueryResult<TableDetailsQueryResult, Error> {
  return useQuery({
    queryKey: [
      TABLES_QUERY_KEY,
      dataSourceConnectionId,
      fullyQualifiedTableName,
    ],
    queryFn: () =>
      getTable({ dataSourceConnectionId, fullyQualifiedTableName }),
  });
}
