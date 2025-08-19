import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';

async function closeContextAgentResult({ jobId }: { jobId: string }) {
  const response = await fetch(`/api/agent-jobs/${jobId}/close`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to close result.');
  }
  return;
}

export function useCloseContextAgentResultMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) =>
      closeContextAgentResult({ jobId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AGENT_JOBS_QUERY_KEY],
      });
    },
  });
}
