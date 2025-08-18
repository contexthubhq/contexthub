import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';
import { z } from 'zod';
import { type Job, jobSchema } from '@contexthub/job-queue';
import {
  ContextAgentResult,
  contextAgentResultSchema,
} from '@contexthub/context-agent';

async function getAgentJobs(): Promise<{
  jobs: Job[];
  results: ContextAgentResult[];
}> {
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
    jobs: z.array(jobSchema),
    results: z.array(contextAgentResultSchema),
  });

  return schema.parse(data);
}

export function useAgentJobsQuery(options?: {
  refetchInterval?: number;
}): UseQueryResult<
  {
    jobs: Job[];
    results: ContextAgentResult[];
  },
  Error
> {
  const { refetchInterval } = options ?? {};
  return useQuery({
    queryKey: [AGENT_JOBS_QUERY_KEY],
    queryFn: () => getAgentJobs(),
    refetchInterval,
  });
}
