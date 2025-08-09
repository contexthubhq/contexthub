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

  async diff(other: ContextWorkingCopy) {
    const kinds: EntityKind[] = ['table', 'column', 'metric', 'concept'];

    const result = {
      table: { added: [], removed: [], modified: [] },
      column: { added: [], removed: [], modified: [] },
      metric: { added: [], removed: [], modified: [] },
      concept: { added: [], removed: [], modified: [] },
    } as any;

    await Promise.all(
      kinds.map(async (kind) => {
        const [thisList, otherList] = await Promise.all([
          this.repo(kind as any).list(),
          other.repo(kind as any).list(),
        ]);

        const thisMap = new Map<string, EntityOf<any>>(
          thisList.map((entity) => [
            getEntityId({ kind: kind as any, entity }),
            entity,
          ])
        );
        const otherMap = new Map<string, EntityOf<any>>(
          otherList.map((entity) => [
            getEntityId({ kind: kind as any, entity }),
            entity,
          ])
        );

        // Added: present in other, not in this
        for (const [id, after] of otherMap.entries()) {
          if (!thisMap.has(id)) {
            (result[kind] as any).added.push(after);
          }
        }

        // Removed: present in this, not in other
        for (const [id, before] of thisMap.entries()) {
          if (!otherMap.has(id)) {
            (result[kind] as any).removed.push(before);
          }
        }

        // Modified: present in both but deep-unequal
        for (const [id, before] of thisMap.entries()) {
          const after = otherMap.get(id);
          if (after && !deepEqual(before, after)) {
            (result[kind] as any).modified.push({ before, after });
          }
        }
      })
    );

    return result;
  }
}

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (
    typeof a !== 'object' ||
    a === null ||
    typeof b !== 'object' ||
    b === null
  ) {
    return false;
  }
  // Handle arrays and plain objects via JSON stable stringification.
  // For our repository entities which are plain data, this is acceptable.
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}
