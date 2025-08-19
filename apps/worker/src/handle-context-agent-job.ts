import { Job } from '@contexthub/job-queue';
import { run } from '@contexthub/context-agent/server';

export async function handleContextAgentJob(job: Job): Promise<void> {
  console.log(
    `[worker] Processing job ${job.id} on queue ${job.queue}`,
    job.payload
  );
  await run({ jobId: job.id });
  console.log(`[worker] Job ${job.id} completed`);
}
