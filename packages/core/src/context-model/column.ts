import { z } from 'zod';

/**
 * A column representation in ContextHub.
 */
export const columnSchema = z.object({
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
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.COLUMN_NAME`
   */
  columnName: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.TABLE_CATALOG`
   */
  tableCatalog: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.TABLE_SCHEMA`
   */
  tableSchema: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.TABLE_NAME`
   */
  tableName: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.ORDINAL_POSITION`
   */
  ordinalPosition: z.number(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.IS_NULLABLE`
   */
  isNullable: z.boolean(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.DATA_TYPE`
   */
  dataType: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.COLUMNS.COLUMN_DEFAULT`
   */
  columnDefault: z.string(),
});

export type Column = z.infer<typeof columnSchema>;
