import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_RESULTS_QUERY_KEY } from './query-keys';
import {
  ContextAgentResult,
  contextAgentResultSchema,
} from '@contexthub/context-agent';
import { z } from 'zod';

async function getAgentResultDetails(
  jobId: string
): Promise<ContextAgentResult | null> {
  const response = await fetch(`/api/agent-results/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch agent result details.');
  }
  const schema = z.object({
    agentResult: contextAgentResultSchema,
  });

  return schema.parse(data).agentResult;
}

export function useAgentResultDetailsQuery(
  jobId: string
): UseQueryResult<ContextAgentResult | null, Error> {
  return useQuery({
    queryKey: [AGENT_RESULTS_QUERY_KEY, jobId],
    queryFn: () => getAgentResultDetails(jobId),
  });
}
