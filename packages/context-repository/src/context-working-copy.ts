import { EntityKind, EntityOf } from './entities.js';

export interface ContextWorkingCopy {
  repo<K extends EntityKind>(
    kind: K
  ): {
    list(): Promise<EntityOf<K>[]>;
    get(id: string): Promise<EntityOf<K> | null>;
    upsert(entity: EntityOf<K>): Promise<void>;
    remove(id: string): Promise<void>;
  };
}
