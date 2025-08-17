export type Job = {
  id: string;
  queue: string;
  payload: any;
  runAt: Date;
  attempts: number;
  maxAttempts: number;
};

/**
 * The queues that jobs can be enqueued to.
 *
 * @see {@link enqueue}
 */
export const QUEUES = {
  CONTEXT_AGENT: 'context-agent',
} as const;
