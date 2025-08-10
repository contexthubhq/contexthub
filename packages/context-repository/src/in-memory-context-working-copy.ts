import { ContextWorkingCopy } from './context-working-copy.js';
import {
  ColumnContext,
  Concept,
  ContextEntity,
  Metric,
  TableContext,
} from '@contexthub/core';
import { EntityOf, getEntityId } from './entities.js';
import type {
  ContextWorkingCopyDiff,
  EntityChanges,
} from './context-working-copy.js';

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

  repo<K extends ContextEntity['kind']>(kind: K) {
    const store = this.data[kind];
    return {
      list: async (): Promise<EntityOf<K>[]> => [...store.values()],
      get: async (id: string): Promise<EntityOf<K> | null> => {
        return store.get(id) ?? null;
      },
      upsert: async (entity: EntityOf<K>): Promise<void> => {
        const newEntityId = getEntityId(entity);
        store.set(newEntityId, entity);
      },
      remove: async (id: string): Promise<void> => {
        store.delete(id);
      },
    };
  }

  private static deepEqual(a: unknown, b: unknown): boolean {
    if (a === b) return true;
    try {
      return JSON.stringify(a) === JSON.stringify(b);
    } catch {
      return false;
    }
  }

  private static arrayToMap<K extends ContextEntity['kind']>(
    entities: EntityOf<K>[]
  ): Map<string, EntityOf<K>> {
    return new Map(entities.map((entity) => [getEntityId(entity), entity]));
  }

  private static computeEntityChanges<K extends ContextEntity['kind']>(
    fromMap: Map<string, EntityOf<K>>,
    toMap: Map<string, EntityOf<K>>
  ): EntityChanges<EntityOf<K>> {
    const added: EntityOf<K>[] = [];
    const removed: EntityOf<K>[] = [];
    const modified: Array<{ before: EntityOf<K>; after: EntityOf<K> }> = [];

    // Added
    for (const [id, toEntity] of toMap.entries()) {
      if (!fromMap.has(id)) {
        added.push(toEntity);
      }
    }

    // Removed and Modified
    for (const [id, fromEntity] of fromMap.entries()) {
      const toEntity = toMap.get(id);
      if (!toEntity) {
        removed.push(fromEntity);
        continue;
      }
      if (!InMemoryContextWorkingCopy.deepEqual(fromEntity, toEntity)) {
        modified.push({ before: fromEntity, after: toEntity });
      }
    }

    return { added, removed, modified };
  }

  async diff(to: ContextWorkingCopy): Promise<ContextWorkingCopyDiff> {
    const [toTables, toColumns, toMetrics, toConcepts] = await Promise.all([
      to.repo('table').list(),
      to.repo('column').list(),
      to.repo('metric').list(),
      to.repo('concept').list(),
    ]);

    const table = InMemoryContextWorkingCopy.computeEntityChanges(
      this.data.table as Map<string, EntityOf<'table'>>,
      InMemoryContextWorkingCopy.arrayToMap(toTables)
    );

    const column = InMemoryContextWorkingCopy.computeEntityChanges(
      this.data.column as Map<string, EntityOf<'column'>>,
      InMemoryContextWorkingCopy.arrayToMap(toColumns)
    );

    const metric = InMemoryContextWorkingCopy.computeEntityChanges(
      this.data.metric as Map<string, EntityOf<'metric'>>,
      InMemoryContextWorkingCopy.arrayToMap(toMetrics)
    );

    const concept = InMemoryContextWorkingCopy.computeEntityChanges(
      this.data.concept as Map<string, EntityOf<'concept'>>,
      InMemoryContextWorkingCopy.arrayToMap(toConcepts)
    );

    return { table, column, metric, concept };
  }
}
