import { tableDefinitionSchema } from '@contexthub/core';
import { z } from 'zod';
import { dataSourceTableTreeSchema } from './table-tree';

export const tablesQueryResultSchema = z.object({
  tables: z.array(tableDefinitionSchema),
  tableTree: dataSourceTableTreeSchema,
});

export type TablesQueryResult = z.infer<typeof tablesQueryResultSchema>;
