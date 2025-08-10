import { z } from 'zod';

/**
 * Natural language context for a table that allows LLMs to understand what's
 * in the table and how to use it in a query.
 */
export const tableContextSchema = z.object({
  kind: z.literal('table'),
  dataSourceConnectionId: z.string(),
  fullyQualifiedTableName: z.string(),
  /**
   * Table description. This is a free-form text field that can be used to
   * describe business context and other information about the table.
   * This will be exposed through the MCP and will help LLMs understand how
   * to use the table in a query.
   */
  description: z.string().nullable(),
});

export type TableContext = z.infer<typeof tableContextSchema>;
