import { tableDefinitionSchema } from '@contexthub/core';
import { z } from 'zod';
import { dataSourceTableTreeSchema } from './table-tree';

export const selectedTableSchema = z.object({
  fullyQualifiedName: z.string(),
});
export const tablesQueryResultSchema = z.object({
  tables: z.array(tableDefinitionSchema),
  tableTree: dataSourceTableTreeSchema,
  tableTreeSelectedOnly: dataSourceTableTreeSchema,
  selectedTables: z.array(selectedTableSchema),
});

export type SelectedTable = z.infer<typeof selectedTableSchema>;

export type TablesQueryResult = z.infer<typeof tablesQueryResultSchema>;
