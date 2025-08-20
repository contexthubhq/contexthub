import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { Concept, conceptSchema, newConceptSchema } from '@contexthub/core';
import { getContextRepository } from '@contexthub/context-repository/server';

async function putConceptHandler(
  request: NextRequest
): Promise<NextResponse<{ success: boolean }>> {
  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodyParsedResult = conceptSchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  await workingCopy.updateConcept(bodyParsed);
  await repository.commit({
    branchName: repository.mainBranchName,
    workingCopy,
  });

  return NextResponse.json({ success: true });
}

async function postConceptHandler(
  request: NextRequest
): Promise<NextResponse<{ success: boolean }>> {
  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodyParsedResult = newConceptSchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  await workingCopy.createConcept(bodyParsed);
  await repository.commit({
    branchName: repository.mainBranchName,
    workingCopy,
  });

  return NextResponse.json({ success: true });
}

async function getConceptsHandler(): Promise<
  NextResponse<{ concepts: Concept[] }>
> {
  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  const concepts = await workingCopy.listConcepts();
  return NextResponse.json({ concepts });
}

export const PUT = withErrorHandling(putConceptHandler);
export const POST = withErrorHandling(postConceptHandler);
export const GET = withErrorHandling(getConceptsHandler);
