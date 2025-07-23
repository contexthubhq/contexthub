import { z } from 'zod';

/**
 * System-defined metadata for a column.
 *
 * The source of this should be the data source INFORMATION_SCHEMA.COLUMNS or
 * equivalent.
 */
export const columnSystemMetadataSchema = z.object({
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
  /**
   * Fully qualified table name. This should be an unambiguous identifier
   * for the table.
   */
  fullyQualifiedTableName: z.string(),
});

export type ColumnSystemMetadata = z.infer<typeof columnSystemMetadataSchema>;

/**
 * Natural language context for a column that allows LLMs to understand what's
 * in the column and how to use it in a query.
 */
export const columnContextSchema = z.object({
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

/**
 * Metadata for a column that includes both system-defined and natural language
 * context.
 */
export const columnMetadataSchema = columnSystemMetadataSchema.extend(
  columnContextSchema.shape
);

export type ColumnMetadata = z.infer<typeof columnMetadataSchema>;
