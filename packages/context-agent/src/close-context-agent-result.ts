import { prisma as defaultPrisma, PrismaClient } from '@contexthub/database';

export async function closeContextAgentResult({
  prisma = defaultPrisma,
  jobId,
}: {
  prisma?: PrismaClient;
  jobId: string;
}): Promise<void> {
  await prisma.contextAgentResult.update({
    where: {
      jobId,
    },
    data: {
      closedAt: new Date(),
    },
  });
}
