import { prisma } from '@contexthub/database';

export async function createDataSourceConnection({
  type,
  name,
  credentials,
}: {
  type: string;
  name: string;
  credentials: Record<string, string>;
}): Promise<void> {
  await prisma.dataSourceConnection.create({
    data: {
      type,
      name,
      credentials,
    },
  });
}
