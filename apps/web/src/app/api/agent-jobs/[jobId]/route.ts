import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { AgentJob } from '@/types/agent-job';
import { ApiError } from '@/lib/api-error';
import { listJobs, QUEUES } from '@contexthub/job-queue';

async function getAgentResultDetailsHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<NextResponse<{ agentJob: AgentJob }>> {
  const jobId = (await params).jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job ID is required');
  }
  const jobs = await listJobs({
    queue: QUEUES.CONTEXT_AGENT,
  });
  const job = jobs.find((job) => job.id === jobId);
  if (!job) {
    throw ApiError.notFound('Agent job not found');
  }
  let status: AgentJob['status'];
  if (job.lockedAt) {
    status = 'running';
  } else if (job.attempts >= job.maxAttempts) {
    status = 'failed';
  } else {
    status = 'pending';
  }
  const agentJob = {
    ...job,
    status,
  };

  return NextResponse.json({ agentJob });
}

export const GET = withErrorHandling(getAgentResultDetailsHandler);
