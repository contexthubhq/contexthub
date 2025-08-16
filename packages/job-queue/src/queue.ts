import { PrismaClient, prisma as defaultPrisma } from '@contexthub/database';
import { Job } from './types.js';

export async function enqueue({
  prisma = defaultPrisma,
  queue,
  payload,
  runAt,
  maxAttempts,
}: {
  prisma: PrismaClient;
  queue: string;
  payload: any;
  runAt?: Date;
  maxAttempts: number;
}): Promise<{ id: string }> {
  return prisma.job.create({
    data: {
      queue,
      payload,
      runAt,
      maxAttempts,
    },
    select: {
      id: true,
    },
  });
}

const DEFAULT_VISIBILITY_MS = 15 * 60 * 1000;

export async function claimOne({
  prisma = defaultPrisma,
  queue,
  visibilityMs = DEFAULT_VISIBILITY_MS,
}: {
  prisma: PrismaClient;
  queue: string;
  visibilityMs?: number;
}): Promise<Job | null> {
  const now = new Date();
  const [locked] = await prisma.$queryRaw<Job[]>`
      WITH candidate AS (
        SELECT id
        FROM "jobs"
        WHERE "queue" = ${queue}
          AND "runAt" <= (${now} AT TIME ZONE 'UTC')
          AND "attempts" < "maxAttempts"
          AND (
            "lockedAt" IS NULL OR
            "lockedAt" < (${now} AT TIME ZONE 'UTC') - (${visibilityMs}::int * INTERVAL '1 millisecond')
          )
        ORDER BY "runAt" ASC, id ASC
        FOR UPDATE SKIP LOCKED
        LIMIT 1
      )
      UPDATE "jobs" j
      SET "lockedAt" = (${now} AT TIME ZONE 'UTC'),
          "attempts" = "attempts" + 1
      FROM candidate
      WHERE j.id = candidate.id
      RETURNING j.*
    `;
  return locked ?? null;
}

export async function completeJob({
  prisma = defaultPrisma,
  id,
}: {
  prisma: PrismaClient;
  id: string;
}): Promise<void> {
  await prisma.job.delete({ where: { id } });
}

export async function failJob({
  prisma = defaultPrisma,
  id,
  error,
  retryDelayMs = 0,
}: {
  prisma: PrismaClient;
  id: string;
  error: string;
  retryDelayMs?: number;
}): Promise<void> {
  const nextRunAt = new Date(Date.now() + retryDelayMs);
  await prisma.job.update({
    where: { id },
    data: { lockedAt: null, lastError: error, runAt: nextRunAt },
  });
}
