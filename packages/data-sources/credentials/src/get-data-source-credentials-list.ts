import { prisma } from '@contexthub/database';

export async function getDataSourceCredentialsList(): Promise<
  { id: string; type: string }[]
> {
  const dataSourceCredentialsList = await prisma.dataSourceCredential.findMany({
    select: {
      id: true,
      type: true,
    },
  });
  return dataSourceCredentialsList;
}
