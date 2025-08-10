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
