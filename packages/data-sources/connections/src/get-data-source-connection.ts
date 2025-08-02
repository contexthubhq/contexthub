import { z } from 'zod';
import { prisma } from '@contexthub/database';
import { type DataSourceConnection } from './types.js';

const credentialsSchema = z.record(z.string(), z.string());

export async function getDataSourceConnection({
  id,
}: {
  id: string;
}): Promise<DataSourceConnection> {
  const dataSourceConnection = await prisma.dataSourceConnection.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      type: true,
      name: true,
      credentials: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!dataSourceConnection) {
    throw new Error(`DataSource connection with id ${id} not found`);
  }
  return {
    ...dataSourceConnection,
    credentials: credentialsSchema.parse(dataSourceConnection.credentials),
  };
}
