import { prisma as defaultPrisma, PrismaClient } from '@contexthub/database';
import { ContextAgentResult, getContextAgentResultStatus } from './types.js';

export async function listContextAgentResults({
  prisma = defaultPrisma,
}: {
  prisma?: PrismaClient;
}): Promise<ContextAgentResult[]> {
  const results = await prisma.contextAgentResult.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return results.map((result) => ({
    ...result,
    status: getContextAgentResultStatus(result),
  }));
}
