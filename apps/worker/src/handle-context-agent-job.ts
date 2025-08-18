import prisma from '@contexthub/database';
import { Job } from '@contexthub/job-queue';

export async function handleContextAgentJob(job: Job): Promise<void> {
  console.log(
    `[worker] Processing job ${job.id} on queue ${job.queue}`,
    job.payload
  );
  await prisma.contextAgentResult.create({
    data: {
      jobId: job.id,
      branchName: 'agent-run-1',
    },
  });
}
