import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';
import { AgentJob, agentJobSchema } from '@/types/agent-job';
import { z } from 'zod';

async function getAgentJobs(): Promise<AgentJob[]> {
  const response = await fetch(`/api/agent-jobs`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch agent jobs.');
  }
  const schema = z.object({
    agentJobs: z.array(agentJobSchema),
  });

  return schema.parse(data).agentJobs;
}

export function useAgentJobsQuery(options?: {
  refetchInterval?: number;
}): UseQueryResult<AgentJob[], Error> {
  const { refetchInterval } = options ?? {};
  return useQuery({
    queryKey: [AGENT_JOBS_QUERY_KEY],
    queryFn: () => getAgentJobs(),
    refetchInterval,
  });
}
