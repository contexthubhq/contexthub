import { prisma } from '@contexthub/database';
import { configurationSchema, type ContextSourceConnection } from './types.js';

export async function getContextSourceConnectionsList(): Promise<
  ContextSourceConnection[]
> {
  const contextSourceConnectionsList =
    await prisma.contextSourceConnection.findMany({
      select: {
        id: true,
        type: true,
        name: true,
        configuration: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  return contextSourceConnectionsList.map((contextSourceConnection) => ({
    ...contextSourceConnection,
    configuration: configurationSchema.parse(
      contextSourceConnection.configuration
    ),
  }));
}
