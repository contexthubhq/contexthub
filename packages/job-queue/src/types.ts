import { z } from 'zod';

export const jobSchema = z.object({
  id: z.string(),
  queue: z.string(),
  payload: z.any(),
  runAt: z.coerce.date(),
  attempts: z.number(),
  maxAttempts: z.number(),
  lastError: z.string().nullable(),
  lockedAt: z.coerce.date().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
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
