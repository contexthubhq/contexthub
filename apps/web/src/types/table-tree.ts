import { tableDefinitionSchema } from '@contexthub/core';
import { z } from 'zod';

export const dataSourceTableTreeSchema = z.object({
  catalogs: z.array(
    z.object({
      name: z.string(),
      schemas: z.array(
        z.object({
          name: z.string(),
          tables: z.array(tableDefinitionSchema),
        })
      ),
    })
  ),
});

export type DataSourceTableTree = z.infer<typeof dataSourceTableTreeSchema>;
