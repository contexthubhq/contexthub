import { EntityKind, EntityOf } from './entities.js';

export type EntityChanges<K extends EntityKind> = {
  added: Array<EntityOf<K>>;
  removed: Array<EntityOf<K>>;
  modified: Array<{ before: EntityOf<K>; after: EntityOf<K> }>;
};

export interface ContextWorkingCopyDiff {
  table: EntityChanges<'table'>;
  column: EntityChanges<'column'>;
  metric: EntityChanges<'metric'>;
  concept: EntityChanges<'concept'>;
}

export interface ContextWorkingCopy {
  repo<K extends EntityKind>(
    kind: K
  ): {
    list(): Promise<EntityOf<K>[]>;
    get(id: string): Promise<EntityOf<K> | null>;
    upsert(entity: EntityOf<K>): Promise<void>;
    remove(id: string): Promise<void>;
  };
  diff(other: ContextWorkingCopy): Promise<ContextWorkingCopyDiff>;
}
