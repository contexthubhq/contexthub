import { ContextWorkingCopy } from './context-working-copy.js';
import {
  ColumnContext,
  Concept,
  ContextEntity,
  Metric,
  TableContext,
} from '@contexthub/core';
import { EntityOf, getEntityId } from './entities.js';

export class InMemoryContextWorkingCopy implements ContextWorkingCopy {
  private data: {
    [K in ContextEntity['kind']]: Map<string, EntityOf<K>>;
  };

  constructor(initialData?: {
    table?: TableContext[];
    column?: ColumnContext[];
    metric?: Metric[];
    concept?: Concept[];
  }) {
    this.data = {
      table: new Map(
        initialData?.table?.map((entity) => [getEntityId(entity), entity])
      ),
      column: new Map(
        initialData?.column?.map((entity) => [getEntityId(entity), entity])
      ),
      metric: new Map(
        initialData?.metric?.map((entity) => [getEntityId(entity), entity])
      ),
      concept: new Map(
        initialData?.concept?.map((entity) => [getEntityId(entity), entity])
      ),
    };
  }

  repo<T extends ContextEntity>(kind: T['kind']) {
    const store = this.data[kind] as Map<string, T>;
    return {
      list: async (): Promise<T[]> => [...store.values()],
      get: async (id: string): Promise<T | null> => {
        return store.get(id) ?? null;
      },
      upsert: async (entity: T): Promise<void> => {
        const newEntityId = getEntityId(entity);
        store.set(newEntityId, entity);
      },
      remove: async (id: string): Promise<void> => {
        store.delete(id);
      },
    };
  }

  async diff(other: ContextWorkingCopy) {
    const kinds: ContextEntity['kind'][] = [
      'table',
      'column',
      'metric',
      'concept',
    ];

    const result = {
      table: { added: [], removed: [], modified: [] },
      column: { added: [], removed: [], modified: [] },
      metric: { added: [], removed: [], modified: [] },
      concept: { added: [], removed: [], modified: [] },
    } as any;

    await Promise.all(
      kinds.map(async (kind) => {
        const [thisList, otherList] = await Promise.all([
          this.repo(kind).list(),
          other.repo(kind).list(),
        ]);

        const thisMap = new Map<string, EntityOf<typeof kind>>(
          thisList.map((entity) => [getEntityId(entity), entity])
        );
        const otherMap = new Map<string, EntityOf<typeof kind>>(
          otherList.map((entity) => [getEntityId(entity), entity])
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
