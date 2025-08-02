import { prisma } from '@contexthub/database';
import { SelectedTable } from './types.js';

export async function updateSelectedTables({
  connectionId,
  selectedTables,
}: {
  connectionId: string;
  selectedTables: SelectedTable[];
}): Promise<void> {
  await prisma.$transaction(async (tx) => {
    await tx.selectedTable.deleteMany({
      where: {
        connectionId,
      },
    });

    await tx.selectedTable.createMany({
      data: selectedTables.map((table) => ({
        connectionId,
        fullyQualifiedName: table.fullyQualifiedName,
      })),
    });
  });
}
