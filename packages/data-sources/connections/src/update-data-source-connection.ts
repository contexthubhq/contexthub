import { prisma } from '@contexthub/database';

export async function updateDataSourceConnection({
  id,
  name,
  credentials,
}: {
  id: string;
  name?: string;
  credentials?: Record<string, string>;
}): Promise<void> {
  await prisma.dataSourceConnection.update({
    where: {
      id,
    },
    data: {
      name,
      credentials,
    },
  });
}
