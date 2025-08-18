import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string(),
  queue: z.string(),
  payload: z.any(),
  runAt: z.date(),
  attempts: z.number(),
  maxAttempts: z.number(),
  lastError: z.string().nullable(),
  lockedAt: z.date().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
  status: z.enum(['pending', 'running', 'failed']),
});

export type Job = z.infer<typeof jobSchema>;

/**
 * The queues that jobs can be enqueued to.
 *
 * @see {@link enqueue}
 */
export const QUEUES = {
  CONTEXT_AGENT: 'context-agent',
} as const;
