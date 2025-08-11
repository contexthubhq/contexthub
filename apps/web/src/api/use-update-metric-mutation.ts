import { useMutation, useQueryClient } from '@tanstack/react-query';
import { METRICS_QUERY_KEY } from './query-keys';
import { Metric } from '@contexthub/core';

async function updateMetric({ metric }: { metric: Metric }) {
  const response = await fetch(`/api/context/metric`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(metric),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to update metric.');
  }
  return;
}

export function useUpdateMetricMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ metric }: { metric: Metric }) => updateMetric({ metric }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [METRICS_QUERY_KEY],
      });
    },
  });
}
