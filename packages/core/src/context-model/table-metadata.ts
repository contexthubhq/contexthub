import { z } from 'zod';

/**
 * Data source definition of a table.
 *
 * The source of this should be the data source INFORMATION_SCHEMA.TABLES or
 * equivalent.
 */
export const tableDefinitionSchema = z.object({
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
   * Fully qualified table name. This should be an unambiguous identifier
   * for the table.
   */
  fullyQualifiedTableName: z.string(),
});

export type TableDefinition = z.infer<typeof tableDefinitionSchema>;

/**
 * Natural language context for a table that allows LLMs to understand what's
 * in the table and how to use it in a query.
 */
export const tableContextSchema = z.object({
  /**
   * Table description. This is a free-form text field that can be used to
   * describe business context and other information about the table.
   * This will be exposed through the MCP and will help LLMs understand how
   * to use the table in a query.
   */
  description: z.string().nullable(),
});

export type TableContext = z.infer<typeof tableContextSchema>;

/**
 * Metadata for a table that includes both system-defined and natural language
 * context.
 */
export const tableMetadataSchema = tableDefinitionSchema.extend(
  tableContextSchema.shape
);

export type TableMetadata = z.infer<typeof tableMetadataSchema>;
