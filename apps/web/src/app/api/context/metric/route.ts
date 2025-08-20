import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';
import { Metric, metricSchema, newMetricSchema } from '@contexthub/core';
import { getContextRepository } from '@contexthub/context-repository/server';

async function putMetricHandler(
  request: NextRequest
): Promise<NextResponse<{ success: boolean }>> {
  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodyParsedResult = metricSchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  await workingCopy.updateMetric(bodyParsed);
  await repository.commit({
    branchName: repository.mainBranchName,
    workingCopy,
  });

  return NextResponse.json({ success: true });
}

async function postMetricHandler(
  request: NextRequest
): Promise<NextResponse<{ success: boolean }>> {
  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodyParsedResult = newMetricSchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  await workingCopy.createMetric(bodyParsed);
  await repository.commit({
    branchName: repository.mainBranchName,
    workingCopy,
  });

  return NextResponse.json({ success: true });
}

async function getMetricsHandler(): Promise<
  NextResponse<{ metrics: Metric[] }>
> {
  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  const metrics = await workingCopy.listMetrics();
  return NextResponse.json({ metrics });
}

export const PUT = withErrorHandling(putMetricHandler);
export const POST = withErrorHandling(postMetricHandler);
export const GET = withErrorHandling(getMetricsHandler);
