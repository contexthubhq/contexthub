import { z } from 'zod';
import {
  columnContextSchema,
  tableContextSchema,
  columnDefinitionSchema,
  tableDefinitionSchema,
} from '@contexthub/core';

export const tableDetailsQueryResultSchema = z.object({
  table: tableContextSchema.merge(tableDefinitionSchema),
  columns: z.array(columnContextSchema.merge(columnDefinitionSchema)),
});

export type TableDetailsQueryResult = z.infer<
  typeof tableDetailsQueryResultSchema
>;
