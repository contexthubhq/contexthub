import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';
import { AgentJob, agentJobSchema } from '@/types/agent-job';
import { z } from 'zod';

async function getAgentJobDetails(jobId: string): Promise<AgentJob | null> {
  const response = await fetch(`/api/agent-jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (response.status === 404) {
    return null;
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch agent job details.');
  }
  const schema = z.object({
    agentJob: agentJobSchema,
  });

  return schema.parse(data).agentJob;
}

export function useAgentJobDetailsQuery(
  jobId: string
): UseQueryResult<AgentJob | null, Error> {
  return useQuery({
    queryKey: [AGENT_JOBS_QUERY_KEY, jobId],
    queryFn: () => getAgentJobDetails(jobId),
  });
}
