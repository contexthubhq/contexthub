import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { createPrismaClient, PrismaClient } from '@contexthub/database';
import { startPostgres, stopPostgres } from './container.js';
import { resetDatabase } from './reset.js';

const pexec = promisify(execFile);

export type TestDbContext = {
  prisma: PrismaClient;
  url: string;
  reset: () => Promise<void>;
  teardown: () => Promise<void>;
};

type PrepareMode = 'migrate' | 'push';

async function prepareSchema(
  databaseUrl: string,
  mode: PrepareMode = 'migrate'
) {
  // We run the Prisma CLI from the db package using pnpm filtering
  const env = { ...process.env, DATABASE_URL: databaseUrl };

  if (mode === 'migrate') {
    await pexec('pnpm', ['-F', '@contexthub/database', 'db:deploy'], { env });
  } else {
    await pexec('pnpm', ['-F', '@contexthub/database', 'db:push'], { env });
  }
}

export async function createTestDbContext(opts?: {
  prepare?: PrepareMode;
}): Promise<TestDbContext> {
  const pg = await startPostgres();
  await prepareSchema(pg.url, opts?.prepare ?? 'migrate');

  const prisma = createPrismaClient({
    datasources: { db: { url: pg.url } },
  });

  return {
    prisma,
    url: pg.url,
    reset: () => resetDatabase(prisma),
    teardown: async () => {
      await prisma.$disconnect();
      await stopPostgres(pg);
    },
  };
}
