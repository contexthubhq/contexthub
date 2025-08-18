import { NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { listContextAgentResults } from '@contexthub/context-agent';
import { ContextAgentResult } from '@contexthub/context-agent';

async function getAgentResultsHandler(): Promise<
  NextResponse<{ agentResults: ContextAgentResult[] }>
> {
  const agentResults = await listContextAgentResults({});

  return NextResponse.json({ agentResults });
}

export const GET = withErrorHandling(getAgentResultsHandler);
