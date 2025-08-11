import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TABLES_QUERY_KEY } from './query-keys';
import { TableContext } from '@contexthub/core';

async function upsertTableContext({
  tableContext,
}: {
  tableContext: TableContext;
}) {
  const response = await fetch(`/api/context/table`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tableContext),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update table context.');
  }
  return;
}

export function useUpsertTableContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ tableContext }: { tableContext: TableContext }) =>
      upsertTableContext({ tableContext }),
    onSuccess: (_, { tableContext }) => {
      queryClient.invalidateQueries({
        queryKey: [TABLES_QUERY_KEY, tableContext.dataSourceConnectionId],
      });
    },
  });
}
