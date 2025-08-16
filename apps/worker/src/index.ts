import 'dotenv/config';
import { enqueue, QUEUES } from '@contexthub/job-queue';
import { runWorker } from './run-worker.js';
import { handleContextAgentJob } from './handle-context-agent-job.js';
import { prisma } from '@contexthub/database';

const POLL_INTERVAL_MS = 1_000;
const VISIBILITY_MS = 10_000;

async function main(): Promise<void> {
  await enqueue({
    prisma,
    queue: QUEUES.CONTEXT_AGENT,
    payload: {
      a: 1,
    },
    maxAttempts: 3,
    runAt: new Date(),
  });
  await runWorker({
    queue: QUEUES.CONTEXT_AGENT,
    visibilityMs: VISIBILITY_MS,
    pollMs: POLL_INTERVAL_MS,
    handle: handleContextAgentJob,
  });
}

void main();
