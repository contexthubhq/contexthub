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
  
  if (!dataSourceConnectionId) {
    throw ApiError.badRequest('Data source connection ID is required');
  }

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
  
  let bodyParsed;
  try {
    bodyParsed = bodySchema.parse(body);
  } catch (error) {
    throw ApiError.badRequest('Invalid request body format', error);
  }

  await updateSelectedTables({
    connectionId: dataSourceConnectionId,
    selectedTables: bodyParsed.selectedTables,
  });

  return NextResponse.json({ success: true });
}

export const PUT = withErrorHandling(putSelectedTablesHandler);
