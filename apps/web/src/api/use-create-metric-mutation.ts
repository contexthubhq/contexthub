import { useMutation, useQueryClient } from '@tanstack/react-query';
import { METRICS_QUERY_KEY } from './query-keys';
import { NewMetric } from '@contexthub/core';

async function createMetric({ metric }: { metric: NewMetric }) {
  const response = await fetch(`/api/context/metric`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create metric.');
  }
  return;
}

export function useCreateMetricMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ metric }: { metric: NewMetric }) => createMetric({ metric }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [METRICS_QUERY_KEY],
      });
    },
  });
}
