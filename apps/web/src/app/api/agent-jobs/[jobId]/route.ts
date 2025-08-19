import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { listJobs, QUEUES, type Job } from '@contexthub/job-queue';
import { ContextAgentResult } from '@contexthub/context-agent';
import { getContextAgentResult } from '@contexthub/context-agent/server';

async function getAgentJobDetailsHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<
  NextResponse<{ job: Job | null; result: ContextAgentResult | null }>
> {
  const jobId = (await params).jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job ID is required');
  }
  const jobs = await listJobs({
    queue: QUEUES.CONTEXT_AGENT,
  });
  const job = jobs.find((job) => job.id === jobId) ?? null;

  const result = await getContextAgentResult({ jobId });

  return NextResponse.json({ job, result });
}

export const GET = withErrorHandling(getAgentJobDetailsHandler);
