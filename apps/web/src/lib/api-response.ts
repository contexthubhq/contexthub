import { NextResponse } from 'next/server';
import { ApiError } from './api-error';

export function createErrorResponse(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        error: {
          message: error.message,
          code: error.code,
          details: error.details,
        },
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    // Log unexpected errors but don't expose details in production
    const message = process.env.NODE_ENV === 'development' 
      ? error.message 
      : 'An unexpected error occurred';

    return NextResponse.json(
      {
        error: {
          message,
          code: 'INTERNAL_ERROR',
        },
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      error: {
        message: 'An unexpected error occurred',
        code: 'INTERNAL_ERROR',
      },
    },
    { status: 500 }
  );
}

export function createSuccessResponse<T>(data: T, status: number = 200): NextResponse<T> {
  return NextResponse.json(data, { status });
}