import { prisma } from '@contexthub/database';

export async function getDataSourceConnectionsList(): Promise<
  { id: string; type: string; name: string }[]
> {
  const dataSourceConnectionsList = await prisma.dataSourceConnection.findMany({
    select: {
      id: true,
      type: true,
      name: true,
    },
  });
  return dataSourceConnectionsList;
}
