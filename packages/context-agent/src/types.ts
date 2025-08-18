import type {
  TableDefinition,
  ColumnDefinition,
  TableContext,
  ColumnContext,
} from '@contexthub/core';
import type { ContextSource } from '@contexthub/context-sources-all';
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
   * The table definition to generate context for
   */
  table: TableDefinition;

  /**
   * List of context sources to use for inference
   */
  contextSources: ContextSource[];
}

/**
 * Input for generating column context
 */
export interface GenerateColumnContextInput {
  /**
   * The id of the data source connection this context is associated with.
   */
  dataSourceConnectionId: string;
  /**
   * The column definition to generate context for
   */
  column: ColumnDefinition;

  /**
   * The table this column belongs to
   */
  table: TableDefinition;

  /**
   * List of context sources to use for inference
   */
  contextSources: ContextSource[];
}

/**
 * Result of table context generation
 */
export interface TableContextResult {
  /**
   * The original table definition
   */
  table: TableDefinition;

  /**
   * Generated table context
   */
  context: TableContext;

  /**
   * Sources used to generate this context
   */
  sourcesUsed: string[];
}

/**
 * Result of column context generation
 */
export interface ColumnContextResult {
  /**
   * The original column definition
   */
  column: ColumnDefinition;

  /**
   * Generated column context
   */
  context: ColumnContext;
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
