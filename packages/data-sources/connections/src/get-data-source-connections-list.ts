import { prisma } from '@contexthub/database';
import { credentialsSchema, DataSourceConnection } from './types.js';

export async function getDataSourceConnectionsList(): Promise<
  DataSourceConnection[]
> {
  const dataSourceConnectionsList = await prisma.dataSourceConnection.findMany({
    select: {
      id: true,
      type: true,
      name: true,
      credentials: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  return dataSourceConnectionsList.map((dataSourceConnection) => ({
    ...dataSourceConnection,
    credentials: credentialsSchema.parse(dataSourceConnection.credentials),
  }));
}
