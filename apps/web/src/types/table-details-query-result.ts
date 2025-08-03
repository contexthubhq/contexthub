import { z } from 'zod';
import { columnMetadataSchema, tableMetadataSchema } from '@contexthub/core';

export const tableDetailsQueryResultSchema = z.object({
  table: tableMetadataSchema,
  columns: z.array(columnMetadataSchema),
});

export type TableDetailsQueryResult = z.infer<
  typeof tableDetailsQueryResultSchema
>;
