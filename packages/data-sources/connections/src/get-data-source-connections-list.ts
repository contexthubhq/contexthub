import { prisma } from '@contexthub/database';

export async function getDataSourceConnectionsList(): Promise<
  { id: string; type: string }[]
> {
  const dataSourceConnectionsList = await prisma.dataSourceCredential.findMany({
    select: {
      id: true,
      type: true,
    },
  });
  return dataSourceConnectionsList;
}
