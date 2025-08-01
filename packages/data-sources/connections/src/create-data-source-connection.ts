import { prisma } from '@contexthub/database';

export async function createDataSourceConnection({
  type,
  credentials,
}: {
  type: string;
  credentials: Record<string, string>;
}): Promise<void> {
  await prisma.dataSourceConnection.create({
    data: {
      type,
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
