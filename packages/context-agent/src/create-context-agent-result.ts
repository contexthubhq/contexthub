import { PrismaClient, prisma as defaultPrisma } from '@contexthub/database';

export async function createContextAgentResult({
  prisma = defaultPrisma,
  jobId,
  branchName,
}: {
  prisma?: PrismaClient;
  jobId: string;
  branchName: string;
}) {
  const result = await prisma.contextAgentResult.create({
    data: {
      jobId,
      branchName,
    },
  });
  return result;
}
