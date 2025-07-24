import { prisma } from '@contexthub/database';
import type { DataSourceCredential } from './types.js';
import { z } from 'zod';

export async function getDataSourceCredentialsList(): Promise<
  DataSourceCredential[]
> {
  const dataSourceCredentialsList = await prisma.dataSourceCredential.findMany({
    select: {
      id: true,
      type: true,
      credentials: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  const credentialsSchema = z.record(z.string(), z.string());
  return dataSourceCredentialsList.map((dataSourceCredential) => {
    return {
      ...dataSourceCredential,
      credentials: credentialsSchema.parse(dataSourceCredential.credentials),
    };
  });
}
