import { updateSelectedTables } from '@contexthub/data-sources-connections';
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';

async function putSelectedTablesHandler(
  request: NextRequest,
  { params }: { params: Promise<{ dataSourceConnectionId: string }> }
): Promise<NextResponse<{ success: boolean }>> {
  const { dataSourceConnectionId } = await params;

  let body;
  try {
    body = await request.json();
  } catch {
    throw ApiError.badRequest('Invalid JSON in request body');
  }

  const bodySchema = z.object({
    selectedTables: z.array(
      z.object({
        fullyQualifiedName: z.string(),
      })
    ),
  });

  const bodyParsedResult = bodySchema.safeParse(body);
  if (!bodyParsedResult.success) {
    throw ApiError.badRequest('Invalid request body format');
  }
  const bodyParsed = bodyParsedResult.data;

  await updateSelectedTables({
    connectionId: dataSourceConnectionId,
    selectedTables: bodyParsed.selectedTables,
  });

  return NextResponse.json({ success: true });
}

export const PUT = withErrorHandling(putSelectedTablesHandler);
