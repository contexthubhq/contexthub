import { ContextEntity } from '@contexthub/core';

export function getEntityId(entity: ContextEntity): string {
  switch (entity.kind) {
    case 'table':
      return `${entity.dataSourceConnectionId}:${entity.fullyQualifiedTableName}`;
    case 'column':
      return `${entity.dataSourceConnectionId}:${entity.fullyQualifiedTableName}:${entity.columnName}`;
    case 'metric':
      return `${entity.id}`;
    case 'concept':
      return `${entity.id}`;
    default: {
      assertNever(entity);
    }
  }
}

export type EntityOf<K extends ContextEntity['kind']> = Extract<
  ContextEntity,
  { kind: K }
>;

export type KindOf<T extends ContextEntity> = T['kind'];

function assertNever(x: never): never {
  return x;
}
