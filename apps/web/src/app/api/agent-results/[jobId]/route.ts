import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import {
  ContextAgentResult,
  getContextAgentResult,
} from '@contexthub/context-agent';
import { ApiError } from '@/lib/api-error';

async function getAgentResultDetailsHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
): Promise<NextResponse<{ agentResult: ContextAgentResult }>> {
  const jobId = (await params).jobId;
  if (!jobId) {
    throw ApiError.badRequest('Job ID is required');
  }
  const agentResult = await getContextAgentResult({ jobId });
  if (!agentResult) {
    throw ApiError.notFound('Agent result not found');
  }

  return NextResponse.json({ agentResult });
}

export const GET = withErrorHandling(getAgentResultDetailsHandler);
