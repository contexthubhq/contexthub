import z from 'zod';

export const contextAgentResultSchema = z.object({
  id: z.string(),
  jobId: z.string(),
  branchName: z.string(),
  closedAt: z.coerce.date().nullable(),
  mergeRevisionId: z.string().nullable(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  status: z.enum(['created', 'merged', 'closed']),
});

export type ContextAgentResult = z.infer<typeof contextAgentResultSchema>;

export function getContextAgentResultStatus(
  result: Pick<ContextAgentResult, 'closedAt' | 'mergeRevisionId'>
): ContextAgentResult['status'] {
  if (result.closedAt) {
    return 'closed';
  }
  if (result.mergeRevisionId) {
    return 'merged';
  }
  return 'created';
}
