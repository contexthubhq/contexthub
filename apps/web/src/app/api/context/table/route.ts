import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { tableContextSchema } from '@contexthub/core';
import { getContextRepository } from '@contexthub/context-repository/server';

async function putTableContextHandler(
  request: NextRequest
): Promise<NextResponse<{ success: boolean }>> {
  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodyParsedResult = tableContextSchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  await workingCopy.upsertTable(bodyParsed);
  await repository.commit({
    branchName: repository.mainBranchName,
    workingCopy,
  });

  return NextResponse.json({ success: true });
}

export const PUT = withErrorHandling(putTableContextHandler);
