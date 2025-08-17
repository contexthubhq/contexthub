import 'dotenv/config';
import { QUEUES } from '@contexthub/job-queue';
import { runWorker } from './run-worker.js';
import { handleContextAgentJob } from './handle-context-agent-job.js';

const POLL_INTERVAL_MS = 1_000; // 1 second
const VISIBILITY_MS = 60 * 60 * 1000; // 1 hour

async function main(): Promise<void> {
  await runWorker({
    queue: QUEUES.CONTEXT_AGENT,
    visibilityMs: VISIBILITY_MS,
    pollMs: POLL_INTERVAL_MS,
    handle: handleContextAgentJob,
  });
}

void main().catch((err) => {
  console.error(err);
  process.exit(1);
});
