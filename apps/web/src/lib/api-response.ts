import { NextResponse } from 'next/server';
import { ApiError } from './api-error';

export function createErrorResponse(error: unknown): NextResponse {
  console.error('API Error:', error);

  if (error instanceof ApiError) {
    return NextResponse.json(
      {
        message: error.message,
      },
      { status: error.status }
    );
  }

  if (error instanceof Error) {
    // Log unexpected errors but don't expose details in production
    const message =
      process.env.NODE_ENV === 'development'
        ? error.message
        : 'An unexpected error occurred';

    return NextResponse.json(
      {
        message,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      message: 'An unexpected error occurred',
    },
    { status: 500 }
  );
}
