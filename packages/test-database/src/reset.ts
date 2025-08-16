import type { PrismaClient } from '@contexthub/database';

export async function resetDatabase(prisma: PrismaClient) {
  const tables = await prisma.$queryRaw<
    { tablename: string }[]
  >`SELECT tablename FROM pg_tables WHERE schemaname='public'`;

  const tableNames = tables
    .map((t) => `"public"."${t.tablename}"`)
    .filter((name) => !name.includes('_prisma_migrations'));

  if (tableNames.length) {
    const query = `TRUNCATE TABLE ${tableNames.join(
      ', '
    )} RESTART IDENTITY CASCADE;`;
    await prisma.$executeRawUnsafe(query);
  }
}
