import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { QUEUES, type Job } from '@contexthub/job-queue';
import { listJobs } from '@contexthub/job-queue/server';
import { ContextAgentResult } from '@contexthub/context-agent';
import { getContextAgentResult } from '@contexthub/context-agent/server';
import {
  ContextWorkingCopyDiff,
  getContextRepository,
} from '@contexthub/context-repository';

async function getAgentJobDetailsHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<
  NextResponse<{
    job: Job | null;
    result: (ContextAgentResult & { diff: ContextWorkingCopyDiff }) | null;
  }>
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
  let resultWithDiff:
    | (ContextAgentResult & { diff: ContextWorkingCopyDiff })
    | null = null;
  if (result) {
    const repository = getContextRepository();
    const mainWorkingCopy = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    const resultWorkingCopy = await repository.checkout({
      branchName: result.branchName,
    });
    const diff = await mainWorkingCopy.diff(resultWorkingCopy);
    resultWithDiff = {
      ...result,
      diff,
    };
  }

  return NextResponse.json({
    job,
    result: resultWithDiff,
  });
}

export const GET = withErrorHandling(getAgentJobDetailsHandler);
