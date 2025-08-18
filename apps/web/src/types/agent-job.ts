import { z } from 'zod';

export const agentJobSchema = z.object({
  id: z.string(),
  status: z.enum(['pending', 'running', 'failed']),
  runAt: z.coerce.date(),
  attempts: z.number(),
  maxAttempts: z.number(),
  lastError: z.string().nullable(),
});

export type AgentJob = z.infer<typeof agentJobSchema>;
