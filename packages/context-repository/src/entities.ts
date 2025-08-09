import {
  MetricDefinition,
  ConceptDefinition,
  tableContextSchema,
  columnContextSchema,
} from '@contexthub/core';
import z from 'zod';

export const tableContextInRepositorySchema = tableContextSchema.extend({
  dataSourceConnectionId: z.string(),
  fullyQualifiedTableName: z.string(),
});

export type TableContextInRepository = z.infer<
  typeof tableContextInRepositorySchema
>;

export const columnContextInRepositorySchema = columnContextSchema.extend({
  dataSourceConnectionId: z.string(),
  fullyQualifiedTableName: z.string(),
  columnName: z.string(),
});

export type ColumnContextInRepository = z.infer<
  typeof columnContextInRepositorySchema
>;

export type EntityKind = 'table' | 'column' | 'metric' | 'concept';

export type EntityOf<K extends EntityKind> = K extends 'table'
  ? TableContextInRepository
  : K extends 'column'
  ? ColumnContextInRepository
  : K extends 'metric'
  ? MetricDefinition
  : K extends 'concept'
  ? ConceptDefinition
  : never;

export function getEntityId<K extends EntityKind>({
  kind,
  entity,
}: {
  kind: K;
  entity: EntityOf<K>;
}): string {
  switch (kind) {
    case 'table':
      const table = entity as TableContextInRepository;
      return `${table.dataSourceConnectionId}:${table.fullyQualifiedTableName}`;
    case 'column':
      const column = entity as ColumnContextInRepository;
      return `${column.dataSourceConnectionId}:${column.fullyQualifiedTableName}:${column.columnName}`;
    case 'metric':
      const metric = entity as MetricDefinition;
      return `${metric.id}`;
    case 'concept':
      const concept = entity as ConceptDefinition;
      return `${concept.id}`;
    default: {
      assertNever(kind);
    }
  }
}

function assertNever(x: never): never {
  return x;
}
