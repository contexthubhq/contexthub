import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { closeContextAgentResult } from '@contexthub/context-agent/server';

async function closeResultHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<NextResponse<{ success: boolean }>> {
  const jobId = (await params).jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job ID is required');
  }
  await closeContextAgentResult({
    jobId,
  });

  return NextResponse.json({ success: true });
}

export const PUT = withErrorHandling(closeResultHandler);
