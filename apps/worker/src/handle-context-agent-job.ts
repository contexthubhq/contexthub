import { Job } from '@contexthub/job-queue';

export async function handleContextAgentJob(job: Job): Promise<void> {
  console.log(
    `[worker] Processing job ${job.id} on queue ${job.queue}`,
    job.payload
  );
  throw new Error('Not implemented');
}
