import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TABLES_QUERY_KEY } from './query-keys';
import { ColumnContext } from '@contexthub/core';

async function upsertColumnContext({
  columnContext,
}: {
  columnContext: ColumnContext;
}) {
  const response = await fetch(`/api/context/column`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(columnContext),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update column context.');
  }
  return;
}

export function useUpsertColumnContextMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ columnContext }: { columnContext: ColumnContext }) =>
      upsertColumnContext({ columnContext }),
    onSuccess: (_, { columnContext }) => {
      queryClient.invalidateQueries({
        queryKey: [TABLES_QUERY_KEY, columnContext.dataSourceConnectionId],
      });
    },
  });
}
