import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TABLES_QUERY_KEY } from './query-keys';

async function updateSelectedTables({
  dataSourceConnectionId,
  selectedTables,
}: {
  dataSourceConnectionId: string;
  selectedTables: { fullyQualifiedName: string }[];
}) {
  const response = await fetch(
    `/api/tables/${dataSourceConnectionId}/selected`,
    {
      method: 'PUT',
      body: JSON.stringify({ selectedTables }),
    }
  );
  if (!response.ok) {
    throw new Error('Failed to update selected tables');
  }
  return;
}

export function useUpdateSelectedTablesMutation({
  dataSourceConnectionId,
}: {
  dataSourceConnectionId: string;
}) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      selectedTables,
    }: {
      selectedTables: { fullyQualifiedName: string }[];
    }) => updateSelectedTables({ dataSourceConnectionId, selectedTables }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [TABLES_QUERY_KEY, dataSourceConnectionId],
      });
    },
  });
}
