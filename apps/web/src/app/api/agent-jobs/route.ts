import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { AgentJob } from '@/types/agent-job';
import { enqueue, listJobs, QUEUES } from '@contexthub/job-queue';

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
  NextResponse<{ agentJobs: AgentJob[] }>
> {
  const jobs = await listJobs({
    queue: QUEUES.CONTEXT_AGENT,
  });
  const agentJobs = jobs.map((job) => {
    let status: AgentJob['status'];
    if (job.lockedAt) {
      status = 'running';
    } else if (job.attempts >= job.maxAttempts) {
      status = 'failed';
    } else {
      status = 'pending';
    }
    return {
      id: job.id,
      status,
      runAt: job.runAt,
      attempts: job.attempts,
      maxAttempts: job.maxAttempts,
      lastError: job.lastError,
    };
  });

  return NextResponse.json({ agentJobs });
}

export const POST = withErrorHandling(postAgentJobHandler);
export const GET = withErrorHandling(getAgentJobsHandler);
