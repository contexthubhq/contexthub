import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';
import { z } from 'zod';
import { type Job, jobSchema } from '@contexthub/job-queue';
import {
  ContextAgentResult,
  contextAgentResultSchema,
} from '@contexthub/context-agent';

async function getAgentJobDetails(jobId: string): Promise<{
  job: Job | null;
  result: ContextAgentResult | null;
}> {
  const response = await fetch(`/api/agent-jobs/${jobId}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to fetch agent job details.');
  }
  const schema = z.object({
    job: jobSchema.nullable(),
    result: contextAgentResultSchema.nullable(),
  });

  return schema.parse(data);
}

export function useAgentJobDetailsQuery(jobId: string): UseQueryResult<
  {
    job: Job | null;
    result: ContextAgentResult | null;
  },
  Error
> {
  return useQuery({
    queryKey: [AGENT_JOBS_QUERY_KEY, jobId],
    queryFn: () => getAgentJobDetails(jobId),
  });
}
