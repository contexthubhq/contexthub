import type { Job } from '@contexthub/job-queue';
import { claimOne, completeJob, failJob } from '@contexthub/job-queue/server';
import { prisma } from '@contexthub/database';

type Handler = (job: Job) => Promise<void>;

/**
 * Runs a worker that claims jobs from the queue and handles them.
 *
 * @param queue - The queue to claim jobs from.
 * @param visibilityMs - The visibility timeout for the job. Jobs shouldn't run
 *   for longer than this.
 * @param pollMs - The poll interval. The worker will sleep for this amount of
 *   time before checking for a new job.
 * @param handle - The handler for the job.
 */
export async function runWorker({
  queue,
  visibilityMs,
  pollMs,
  handle,
}: {
  queue: string;
  visibilityMs: number;
  pollMs: number;
  handle: Handler;
}): Promise<void> {
  console.log(
    `[worker] Started. Queue: ${queue}. Visibility: ${visibilityMs} ms. Poll: ${pollMs} ms.`
  );

  for (;;) {
    const job = await claimOne({ prisma, queue, visibilityMs });

    if (!job) {
      await sleep(pollMs);
      continue;
    }

    try {
      await handle(job);
      await completeJob({ prisma, id: job.id });
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.stack || err.message : String(err);
      const delay = getRetryDelayMs({ attempt: job.attempts });
      await failJob({
        prisma,
        id: job.id,
        error: errorMessage,
        retryDelayMs: delay,
      });
    }
  }
}

function getRetryDelayMs({
  attempt,
  baseMs = 1000,
  maxMs = 60_000,
}: {
  attempt: number;
  baseMs?: number;
  maxMs?: number;
}): number {
  const jitter = Math.random() * 0.25 + 0.875; // 12.5% jitter
  return Math.min(maxMs, Math.floor(baseMs * 2 ** (attempt - 1) * jitter));
}

async function sleep(ms: number): Promise<void> {
  return new Promise((res) => setTimeout(res, ms));
}
