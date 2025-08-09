import { ContextWorkingCopy } from './context-working-copy.js';
import { EntityKind, EntityOf, getEntityId } from './entities.js';

export class InMemoryContextWorkingCopy implements ContextWorkingCopy {
  private data: { [K in EntityKind]: Map<string, EntityOf<K>> };

  constructor(initialData?: {
    table?: EntityOf<'table'>[];
    column?: EntityOf<'column'>[];
    metric?: EntityOf<'metric'>[];
    concept?: EntityOf<'concept'>[];
  }) {
    this.data = {
      table: new Map(
        initialData?.table?.map((entity) => [
          getEntityId({ kind: 'table', entity }),
          entity,
        ])
      ),
      column: new Map(
        initialData?.column?.map((entity) => [
          getEntityId({ kind: 'column', entity }),
          entity,
        ])
      ),
      metric: new Map(
        initialData?.metric?.map((entity) => [
          getEntityId({ kind: 'metric', entity }),
          entity,
        ])
      ),
      concept: new Map(
        initialData?.concept?.map((entity) => [
          getEntityId({ kind: 'concept', entity }),
          entity,
        ])
      ),
    };
  }

  repo<K extends EntityKind>(kind: K) {
    const store = this.data[kind];
    return {
      list: async () => [...store.values()],
      get: async (id: string) => {
        return store.get(id) ?? null;
      },
      upsert: async (entity: EntityOf<K>) => {
        const newEntityId = getEntityId({ kind, entity });
        store.set(newEntityId, entity);
      },
      remove: async (id: string) => {
        store.delete(id);
      },
    };
  }
}
