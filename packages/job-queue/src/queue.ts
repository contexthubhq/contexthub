import { prisma } from '@contexthub/database';
import { Job } from './types.js';

export async function enqueue({
  queue,
  payload,
  runAt,
  maxAttempts,
}: {
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
  queue,
  visibilityMs = DEFAULT_VISIBILITY_MS,
}: {
  queue: string;
  visibilityMs?: number;
}): Promise<Job | null> {
  return prisma.$transaction(async (tx) => {
    const [candidate] = await tx.$queryRaw<{ id: string }[]>`
      SELECT id
      FROM "jobs"
      WHERE "queue" = ${queue}
        AND "runAt" <= NOW()
        AND "attempts" < "maxAttempts"
        AND (
          "lockedAt" IS NULL OR
          "lockedAt" < NOW() - (${visibilityMs}::int * INTERVAL '1 millisecond'))
      ORDER BY "runAt" ASC, id ASC
      FOR UPDATE SKIP LOCKED
      LIMIT 1
    `;

    if (!candidate) return null;

    const [locked] = await tx.$queryRaw<Job[]>`
      UPDATE "jobs" j
         SET "lockedAt" = NOW(),
             "attempts" = "attempts" + 1
       WHERE j.id = ${candidate.id}
       RETURNING *
    `;
    return locked ?? null;
  });
}

export async function completeJob({ id }: { id: string }): Promise<void> {
  await prisma.job.delete({ where: { id } });
}

export async function failJob({
  id,
  error,
}: {
  id: string;
  error: string;
}): Promise<void> {
  await prisma.job.update({
    where: { id },
    data: { lockedAt: null, lastError: error },
  });
}
