import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';

async function createAgentJob() {
  const response = await fetch(`/api/agent-jobs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create concept.');
  }
  return;
}

export function useCreateAgentJobMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => createAgentJob(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [AGENT_JOBS_QUERY_KEY],
      });
    },
  });
}
