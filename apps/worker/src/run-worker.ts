import { Job, claimOne, completeJob, failJob } from '@contexthub/job-queue';
import { prisma } from '@contexthub/database';

type Handler = (job: Job) => Promise<void>;

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
}) {
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
}) {
  const jitter = Math.random() * 0.25 + 0.875; // 12.5% jitter
  return Math.min(maxMs, Math.floor(baseMs * 2 ** (attempt - 1) * jitter));
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms));
}
