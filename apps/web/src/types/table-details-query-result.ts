import { z } from 'zod';
import {
  columnContextSchema,
  tableContextSchema,
  columnDefinitionSchema,
  tableDefinitionSchema,
} from '@contexthub/core';

export const tableMetadataSchema = tableContextSchema.merge(
  tableDefinitionSchema
);
export type TableMetadata = z.infer<typeof tableMetadataSchema>;

export const columnMetadataSchema = columnContextSchema.merge(
  columnDefinitionSchema
);
export type ColumnMetadata = z.infer<typeof columnMetadataSchema>;

export const tableDetailsQueryResultSchema = z.object({
  table: tableMetadataSchema,
  columns: z.array(columnMetadataSchema),
});

export type TableDetailsQueryResult = z.infer<
  typeof tableDetailsQueryResultSchema
>;
