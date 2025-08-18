import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_RESULTS_QUERY_KEY } from './query-keys';
import {
  ContextAgentResult,
  contextAgentResultSchema,
} from '@contexthub/context-agent';
import { z } from 'zod';

async function getAgentResults(): Promise<ContextAgentResult[]> {
  const response = await fetch(`/api/agent-results`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch agent results.');
  }
  const schema = z.object({
    agentResults: z.array(contextAgentResultSchema),
  });

  return schema.parse(data).agentResults;
}

export function useAgentResultsQuery(options?: {
  refetchInterval?: number;
}): UseQueryResult<ContextAgentResult[], Error> {
  const { refetchInterval } = options ?? {};
  return useQuery({
    queryKey: [AGENT_RESULTS_QUERY_KEY],
    queryFn: () => getAgentResults(),
    refetchInterval,
  });
}
