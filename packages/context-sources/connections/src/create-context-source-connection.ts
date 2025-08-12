import { prisma } from '@contexthub/database';

export async function createContextSourceConnection({
  type,
  name,
  configuration,
}: {
  type: string;
  name: string;
  configuration: Record<string, string>;
}): Promise<void> {
  await prisma.contextSourceConnection.create({
    data: {
      type,
      name,
      configuration,
    },
  });
}
