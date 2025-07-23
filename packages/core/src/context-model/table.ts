import { z } from 'zod';
import { columnSchema } from './column.js';

/**
 * A table representation in ContextHub.
 */
export const tableSchema = z.object({
  /**
   * Table description. This is a free-form text field that can be used to
   * describe business context and other information about the table.
   * This will be exposed through the MCP and will help LLMs understand how
   * to use the table in a query.
   */
  description: z.string().nullable(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.TABLES.TABLE_NAME`
   */
  tableName: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.TABLES.TABLE_SCHEMA`
   */
  tableSchema: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.TABLES.TABLE_CATALOG`
   */
  tableCatalog: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.TABLES.TABLE_TYPE`
   */
  tableType: z.string(),
  /**
   * Corresponds to `INFORMATION_SCHEMA.TABLES.CREATION_TIME`
   */
  creationTime: z.coerce.date(),
  /**
   * Fully qualified table name. This should be an unambiguous identifier
   * for the table.
   */
  fullyQualifiedTableName: z.string(),
  /**
   * Columns in the table.
   */
  columns: z.array(columnSchema),
});

export type Table = z.infer<typeof tableSchema>;
