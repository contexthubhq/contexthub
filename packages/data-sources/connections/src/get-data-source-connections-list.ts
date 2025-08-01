import { prisma } from '@contexthub/database';

export async function getDataSourceConnectionsList(): Promise<
  { id: string; type: string }[]
> {
  const dataSourceConnectionsList = await prisma.dataSourceConnection.findMany({
    select: {
      id: true,
      type: true,
    },
  });
  return dataSourceConnectionsList;
}
