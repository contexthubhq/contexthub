import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { METRICS_QUERY_KEY } from './query-keys';
import { Metric, metricSchema } from '@contexthub/core';
import z from 'zod';

async function getMetrics(): Promise<Metric[]> {
  const response = await fetch(`/api/context/metric`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch metrics.');
  }
  const schema = z.object({
    metrics: z.array(metricSchema),
  });

  return schema.parse(data).metrics;
}

export function useMetricsQuery(): UseQueryResult<Metric[], Error> {
  return useQuery({
    queryKey: [METRICS_QUERY_KEY],
    queryFn: () => getMetrics(),
  });
}
