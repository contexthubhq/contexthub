import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';

async function mergeContextAgentResult({ jobId }: { jobId: string }) {
  const response = await fetch(`/api/agent-jobs/${jobId}/merge`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to merge result.');
  }
  return;
}

export function useMergeContextAgentResultMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ jobId }: { jobId: string }) =>
      mergeContextAgentResult({ jobId }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AGENT_JOBS_QUERY_KEY],
      });
    },
  });
}
