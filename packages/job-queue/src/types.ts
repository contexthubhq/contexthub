export type Job = {
  id: string;
  queue: string;
  payload: any;
  runAt: Date;
  attempts: number;
  maxAttempts: number;
};
