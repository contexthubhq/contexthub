import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { QUEUES, type Job } from '@contexthub/job-queue';
import { enqueue, listJobs } from '@contexthub/job-queue/server';
import { ContextAgentResult } from '@contexthub/context-agent';
import { listContextAgentResults } from '@contexthub/context-agent/server';

async function postAgentJobHandler(): Promise<
  NextResponse<{ success: boolean }>
> {
  try {
    await enqueue({
      queue: QUEUES.CONTEXT_AGENT,
      payload: {},
    });
  } catch (error) {
    throw ApiError.internal('Failed to enqueue job');
  }

  return NextResponse.json({ success: true });
}

async function getAgentJobsHandler(): Promise<
  NextResponse<{ jobs: Job[]; results: ContextAgentResult[] }>
> {
  const jobs = await listJobs({
    queue: QUEUES.CONTEXT_AGENT,
  });
  const results = await listContextAgentResults({});
  return NextResponse.json({ jobs, results });
}

export const POST = withErrorHandling(postAgentJobHandler);
export const GET = withErrorHandling(getAgentJobsHandler);
