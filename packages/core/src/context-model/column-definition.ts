import { z } from 'zod';

/**
 * Data source definition of a column.
 *
 * The source of this should be the data source INFORMATION_SCHEMA.COLUMNS or
 * equivalent.
 */
export const columnDefinitionSchema = z.object({
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
  columnDefault: z.string().nullable(),
  /**
   * Fully qualified table name. This should be an unambiguous identifier
   * for the table.
   */
  fullyQualifiedTableName: z.string(),
  /**
   * Fully qualified column name. This should be an unambiguous identifier
   * for the column.
   */
  fullyQualifiedColumnName: z.string(),
});

export type ColumnDefinition = z.infer<typeof columnDefinitionSchema>;
