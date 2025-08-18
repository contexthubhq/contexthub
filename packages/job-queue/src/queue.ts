import { PrismaClient, prisma as defaultPrisma } from '@contexthub/database';
import { Job } from './types.js';

export async function listJobs({
  prisma = defaultPrisma,
  queue,
}: {
  prisma?: PrismaClient;
  queue?: string;
}): Promise<Job[]> {
  return prisma.job.findMany({
    where: { queue },
    orderBy: { runAt: 'asc' },
  });
}

/**
 * Enqueues a job to be run at a given time.
 *
 * @param prisma - The Prisma client to use.
 * @param queue - The queue to enqueue the job to. See {@link QUEUES} for
 *   available queues.
 * @param payload - The payload of the job.
 * @param runAt - The time at which to run the job. Defaults to now.
 * @param maxAttempts - The maximum number of times to attempt to run the job.
 *   Defaults to 1.
 * @returns The ID of the enqueued job.
 */
export async function enqueue({
  prisma = defaultPrisma,
  queue,
  payload,
  runAt = new Date(),
  maxAttempts = 1,
}: {
  prisma?: PrismaClient;
  queue: string;
  payload: any;
  runAt?: Date;
  maxAttempts?: number;
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

const DEFAULT_VISIBILITY_MS = 30 * 1000; // 30 seconds

/**
 * Claims a job from the queue.
 *
 * @param prisma - The Prisma client to use.
 * @param queue - The queue to claim a job from. See {@link QUEUES} for
 *   available queues.
 * @param visibilityMs - The visibility timeout for the job. Defaults to 30 seconds.
 *   If a job is claimed, and is not completed or failed within this time, the job
 *   will be made available again.
 * @returns The claimed job, or null if no job is available.
 */
export async function claimOne({
  prisma = defaultPrisma,
  queue,
  visibilityMs = DEFAULT_VISIBILITY_MS,
}: {
  prisma?: PrismaClient;
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

/**
 * Completes a job.
 *
 * @param prisma - The Prisma client to use.
 * @param id - The ID of the job to complete.
 */
export async function completeJob({
  prisma = defaultPrisma,
  id,
}: {
  prisma?: PrismaClient;
  id: string;
}): Promise<void> {
  await prisma.job.delete({ where: { id } });
}

/**
 * Fails a job making it available again after a delay.
 *
 * @param prisma - The Prisma client to use.
 * @param id - The ID of the job to fail.
 * @param error - The error that occurred.
 * @param retryDelayMs - The delay before the job is retried. Defaults to 0.
 */
export async function failJob({
  prisma = defaultPrisma,
  id,
  error,
  retryDelayMs = 0,
}: {
  prisma?: PrismaClient;
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

/**
 * Heartbeats a job.
 *
 * This prevents long running jobs to be claimed again by another worker.
 *
 * @param prisma - The Prisma client to use.
 * @param id - The ID of the job to heartbeat.
 */
export async function heartbeat({
  prisma = defaultPrisma,
  id,
}: {
  prisma?: PrismaClient;
  id: string;
}): Promise<void> {
  await prisma.job.update({ where: { id }, data: { lockedAt: new Date() } });
}
