import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { AGENT_JOBS_QUERY_KEY } from './query-keys';
import { z } from 'zod';
import { type Job, jobSchema } from '@contexthub/job-queue';
import {
  ContextAgentResult,
  contextAgentResultSchema,
} from '@contexthub/context-agent';
import { ContextWorkingCopyDiff } from '@contexthub/context-repository';

async function getAgentJobDetails(jobId: string): Promise<{
  job: Job | null;
  result: (ContextAgentResult & { diff: ContextWorkingCopyDiff }) | null;
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
    result: contextAgentResultSchema
      .extend({
        // The diff is a complicated type so we skip parsing it.
        diff: z.any(),
      })
      .nullable(),
  });
  const parsed = schema.parse(data);
  return {
    job: parsed.job,
    result: parsed.result
      ? {
          ...parsed.result,
          // The diff is a complicated type so we skip parsing it.
          diff: parsed.result.diff as ContextWorkingCopyDiff,
        }
      : null,
  };
}

export function useAgentJobDetailsQuery(jobId: string): UseQueryResult<
  {
    job: Job | null;
    result: (ContextAgentResult & { diff: ContextWorkingCopyDiff }) | null;
  },
  Error
> {
  return useQuery({
    queryKey: [AGENT_JOBS_QUERY_KEY, jobId],
    queryFn: () => getAgentJobDetails(jobId),
  });
}
