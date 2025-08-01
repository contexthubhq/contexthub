import { z } from 'zod';
import { prisma } from '@contexthub/database';
import { type DataSourceConnection } from './types.js';

const credentialsSchema = z.record(z.string(), z.string());

export async function getDataSourceConnection({
  dataSourceId,
}: {
  dataSourceId: string;
}): Promise<DataSourceConnection> {
  const dataSourceConnection = await prisma.dataSourceCredential.findUnique({
    where: {
      id: dataSourceId,
    },
    select: {
      id: true,
      type: true,
      credentials: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!dataSourceConnection) {
    throw new Error(`DataSource connection with id ${dataSourceId} not found`);
  }
  return {
    ...dataSourceConnection,
    credentials: credentialsSchema.parse(dataSourceConnection.credentials),
  };
}
