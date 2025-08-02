import { tableDefinitionSchema } from '@contexthub/core';
import { z } from 'zod';
import { dataSourceTableTreeSchema } from './table-tree';

export const dataSourceConnectionDetailsSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.string(),
  tables: z.array(tableDefinitionSchema),
  tableTree: dataSourceTableTreeSchema,
});

export type DataSourceConnectionDetails = z.infer<
  typeof dataSourceConnectionDetailsSchema
>;
