import { z } from 'zod';
import { prisma } from '@contexthub/database';
import { type DataSourceCredential } from './types.js';

const credentialsSchema = z.record(z.string(), z.string());

export async function getDataSourceCredentials({
  dataSourceId,
}: {
  dataSourceId: string;
}): Promise<DataSourceCredential> {
  const dataSourceCredentials = await prisma.dataSourceCredential.findUnique({
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
  if (!dataSourceCredentials) {
    throw new Error(`DataSource credential with id ${dataSourceId} not found`);
  }
  return {
    ...dataSourceCredentials,
    credentials: credentialsSchema.parse(dataSourceCredentials.credentials),
  };
}
