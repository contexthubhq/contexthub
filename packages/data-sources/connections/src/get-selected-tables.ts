import { prisma } from '@contexthub/database';
import { SelectedTable } from './types.js';

export async function getSelectedTables({
  connectionId,
}: {
  connectionId: string;
}): Promise<SelectedTable[]> {
  const selectedTables = await prisma.selectedTable.findMany({
    where: {
      connectionId,
    },
    select: {
      fullyQualifiedName: true,
    },
  });

  return selectedTables;
}
