import { z } from 'zod';

/**
 * Natural language context for a column that allows LLMs to understand what's
 * in the column and how to use it in a query.
 */
export const columnContextSchema = z.object({
  dataSourceConnectionId: z.string(),
  fullyQualifiedTableName: z.string(),
  columnName: z.string(),
  /**
   * Column description. This is a free-form text field that can be used to
   * describe business context and other information about the column.
   * This will be exposed through the MCP and will help LLMs understand how
   * to use the column in a query.
   */
  description: z.string().nullable(),
  /**
   * Example values for the column. This is a list of values that can be used
   * to help LLMs understand the column.
   */
  exampleValues: z.array(z.string()),
});

export type ColumnContext = z.infer<typeof columnContextSchema>;
