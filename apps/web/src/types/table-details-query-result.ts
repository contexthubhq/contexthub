import { z } from 'zod';
import {
  columnContextSchema,
  tableContextSchema,
  columnDefinitionSchema,
  tableDefinitionSchema,
} from '@contexthub/core';

export const tableSchema = z.object({
  tableDefinition: tableDefinitionSchema,
  tableContext: tableContextSchema,
});

export type Table = z.infer<typeof tableSchema>;

export const columnSchema = z.object({
  columnDefinition: columnDefinitionSchema,
  columnContext: columnContextSchema,
});

export type Column = z.infer<typeof columnSchema>;

export const tableDetailsQueryResultSchema = z.object({
  table: tableSchema,
  columns: z.array(columnSchema),
});

export type TableDetailsQueryResult = z.infer<
  typeof tableDetailsQueryResultSchema
>;
