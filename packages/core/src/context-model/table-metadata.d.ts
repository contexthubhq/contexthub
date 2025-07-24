import { z } from 'zod';
/**
 * System-defined metadata for a table.
 *
 * The source of this should be the data source INFORMATION_SCHEMA.TABLES or
 * equivalent.
 */
export declare const tableSystemMetadataSchema: z.ZodObject<{
    tableName: z.ZodString;
    tableSchema: z.ZodString;
    tableCatalog: z.ZodString;
    tableType: z.ZodString;
    creationTime: z.ZodCoercedDate<unknown>;
    fullyQualifiedTableName: z.ZodString;
}, z.core.$strip>;
export type TableSystemMetadata = z.infer<typeof tableSystemMetadataSchema>;
/**
 * Natural language context for a table that allows LLMs to understand what's
 * in the table and how to use it in a query.
 */
export declare const tableContextSchema: z.ZodObject<{
    description: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type TableContext = z.infer<typeof tableContextSchema>;
/**
 * Metadata for a table that includes both system-defined and natural language
 * context.
 */
export declare const tableMetadataSchema: z.ZodObject<{
    tableName: z.ZodString;
    tableSchema: z.ZodString;
    tableCatalog: z.ZodString;
    tableType: z.ZodString;
    creationTime: z.ZodCoercedDate<unknown>;
    fullyQualifiedTableName: z.ZodString;
    description: z.ZodNullable<z.ZodString>;
}, z.core.$strip>;
export type TableMetadata = z.infer<typeof tableMetadataSchema>;
//# sourceMappingURL=table-metadata.d.ts.map