import type {
  TableDefinition,
  ColumnDefinition,
  TableContext,
  ColumnContext,
} from '@contexthub/core';
import z from 'zod';

/**
 * Input for generating table context
 */
export interface GenerateTableContextInput {
  /**
   * The id of the data source connection this context is associated with.
   */
  dataSourceConnectionId: string;
  /**
   * The name of the data source connection this context is associated with.
   * This can be used to identify the data source in question when using context sources.
   */
  dataSourceConnectionName: string;
  /**
   * The table definition to generate context for
   */
  tableDefinition: TableDefinition;
  /**
   * The columns to generate context for.
   */
  columnDefinitions: ColumnDefinition[];
  /**
   * Existing table context to use as a starting point.
   */
  existingTableContext: TableContext | null;
  /**
   * Existing column context to use as a starting point.
   */
  existingColumnContexts: ColumnContext[];
}

/**
 * Result of table context generation
 */
export interface TableContextResult {
  /**
   * Generated table context
   */
  newTableContext: TableContext;
  /**
   * Generated column contexts
   */
  newColumnContexts: ColumnContext[];
}

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
