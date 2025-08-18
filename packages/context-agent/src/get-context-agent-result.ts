import { prisma as defaultPrisma, PrismaClient } from '@contexthub/database';
import { ContextAgentResult, getContextAgentResultStatus } from './types.js';

export async function getContextAgentResult({
  prisma = defaultPrisma,
  jobId,
}: {
  prisma?: PrismaClient;
  jobId: string;
}): Promise<ContextAgentResult | null> {
  const result = await prisma.contextAgentResult.findUnique({
    where: {
      jobId,
    },
  });
  if (!result) {
    return null;
  }
  return {
    ...result,
    status: getContextAgentResultStatus(result),
  };
}
