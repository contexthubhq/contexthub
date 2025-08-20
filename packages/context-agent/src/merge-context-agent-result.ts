import { prisma as defaultPrisma, PrismaClient } from '@contexthub/database';
import { getContextAgentResult } from './get-context-agent-result.js';
import { getContextRepository } from '@contexthub/context-repository/server';

export async function mergeContextAgentResult({
  prisma = defaultPrisma,
  jobId,
}: {
  prisma?: PrismaClient;
  jobId: string;
}): Promise<void> {
  const result = await getContextAgentResult({
    prisma,
    jobId,
  });
  if (!result) {
    throw new Error('Result not found');
  }
  const repository = getContextRepository();
  const { revisionId } = await repository.merge({
    sourceBranchName: result.branchName,
    targetBranchName: repository.mainBranchName,
  });
  await prisma.contextAgentResult.update({
    where: {
      jobId,
    },
    data: {
      mergeRevisionId: revisionId,
    },
  });
}
