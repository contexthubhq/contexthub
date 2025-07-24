import { DataSourceCredential, prisma } from '@contexthub/database';

export async function createDataSourceCredentials({
  type,
  credentials,
}: {
  type: string;
  credentials: Record<string, string>;
}): Promise<DataSourceCredential> {
  const existingDataSourceCredential =
    await prisma.dataSourceCredential.findFirst({
      where: {
        type,
      },
    });
  // Currently only support one credential per data source type.
  if (existingDataSourceCredential) {
    throw new Error('DataSourceCredential already exists');
  }
  const dataSourceCredential = await prisma.dataSourceCredential.create({
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
  return dataSourceCredential;
}
