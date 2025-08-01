import { prisma } from '@contexthub/database';

export async function updateDataSourceConnection({
  id,
  credentials,
}: {
  id: string;
  credentials: Record<string, string>;
}): Promise<void> {
  await prisma.dataSourceCredential.update({
    where: {
      id,
    },
    data: {
      credentials,
    },
  });
}
