import { DataSourceCredential, prisma } from '@contexthub/database';

export async function updateDataSourceCredentials({
  id,
  credentials,
}: {
  id: string;
  credentials: Record<string, string>;
}): Promise<DataSourceCredential> {
  const dataSourceCredential = await prisma.dataSourceCredential.update({
    where: {
      id,
    },
    data: {
      credentials,
    },
  });
  return dataSourceCredential;
}
