import { NextRequest, NextResponse } from 'next/server';
import { createErrorResponse } from './api-response';

type ApiHandler<T = any> = (
  request: NextRequest,
  context: T
) => Promise<NextResponse>;

export function withErrorHandling<T = any>(handler: ApiHandler<T>): ApiHandler<T> {
  return async (request: NextRequest, context: T) => {
    try {
      return await handler(request, context);
    } catch (error) {
      return createErrorResponse(error);
    }
  };
}