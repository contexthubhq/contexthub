import { enqueue, claimOne, completeJob, failJob } from './queue.js';

async function run() {
  const jobEmpty = await claimOne({ queue: 'default' });
  console.log('jobEmpty', jobEmpty);
  const { id } = await enqueue({
    queue: 'default',
    payload: {
      message: 'Hello, world!',
    },
    maxAttempts: 3,
  });
  console.log('created', id);
  const claimed = await claimOne({ queue: 'default' });
  console.log('claimed', claimed);
  // await completeJob({ id: claimed!.id });
  // console.log('completed');
  // console.log('jobEmpty', await claimOne({ queue: 'default' }));
  // const newJob = await enqueue({
  //   queue: 'default',
  //   payload: {
  //     message: 'Hello, world again',
  //   },
  //   maxAttempts: 3,
  // });
  // console.log('newJob', newJob);
  // const claimed2 = await claimOne({ queue: 'default' });
  // console.log('claimed2', claimed2);
  // await failJob({ id: claimed2!.id, error: 'test' });
}

run();
