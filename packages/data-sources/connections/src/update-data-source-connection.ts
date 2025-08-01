import { prisma } from '@contexthub/database';

export async function updateDataSourceConnection({
  id,
  credentials,
}: {
  id: string;
  credentials: Record<string, string>;
}): Promise<void> {
  await prisma.dataSourceConnection.update({
    where: {
      id,
    },
    data: {
      credentials,
    },
    select: {
      id: true,
      type: true,
      credentials: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}
