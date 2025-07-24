import { z } from 'zod';
/**
 * System-defined metadata for a column.
 *
 * The source of this should be the data source INFORMATION_SCHEMA.COLUMNS or
 * equivalent.
 */
export declare const columnSystemMetadataSchema: z.ZodObject<{
    columnName: z.ZodString;
    tableCatalog: z.ZodString;
    tableSchema: z.ZodString;
    tableName: z.ZodString;
    ordinalPosition: z.ZodNumber;
    isNullable: z.ZodBoolean;
    dataType: z.ZodString;
    columnDefault: z.ZodString;
    fullyQualifiedTableName: z.ZodString;
}, z.core.$strip>;
export type ColumnSystemMetadata = z.infer<typeof columnSystemMetadataSchema>;
/**
 * Natural language context for a column that allows LLMs to understand what's
 * in the column and how to use it in a query.
 */
export declare const columnContextSchema: z.ZodObject<{
    description: z.ZodNullable<z.ZodString>;
    exampleValues: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ColumnContext = z.infer<typeof columnContextSchema>;
/**
 * Metadata for a column that includes both system-defined and natural language
 * context.
 */
export declare const columnMetadataSchema: z.ZodObject<{
    columnName: z.ZodString;
    tableCatalog: z.ZodString;
    tableSchema: z.ZodString;
    tableName: z.ZodString;
    ordinalPosition: z.ZodNumber;
    isNullable: z.ZodBoolean;
    dataType: z.ZodString;
    columnDefault: z.ZodString;
    fullyQualifiedTableName: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
    exampleValues: z.ZodArray<z.ZodString>;
}, z.core.$strip>;
export type ColumnMetadata = z.infer<typeof columnMetadataSchema>;
//# sourceMappingURL=column-metadata.d.ts.map