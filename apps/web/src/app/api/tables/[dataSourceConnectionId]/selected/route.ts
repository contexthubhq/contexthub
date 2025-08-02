import { updateSelectedTables } from '@contexthub/data-sources-connections';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ dataSourceConnectionId: string }> }
): Promise<NextResponse<{ success: boolean; error?: string }>> {
  try {
    const { dataSourceConnectionId } = await params;
    const body = await request.json();
    const bodySchema = z.object({
      selectedTables: z.array(
        z.object({
          fullyQualifiedName: z.string(),
        })
      ),
    });
    const bodyParsed = bodySchema.parse(body);

    await updateSelectedTables({
      connectionId: dataSourceConnectionId,
      selectedTables: bodyParsed.selectedTables,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Failed to update selected tables',
    });
  }
}
