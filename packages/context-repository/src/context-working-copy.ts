import {
  ColumnContext,
  Concept,
  ContextEntity,
  Metric,
  TableContext,
} from '@contexthub/core';
import type { EntityOf } from './entities.js';

export type EntityChanges<T extends ContextEntity> = {
  added: Array<T>;
  removed: Array<T>;
  modified: Array<{ before: T; after: T }>;
};

export interface ContextWorkingCopyDiff {
  table: EntityChanges<TableContext>;
  column: EntityChanges<ColumnContext>;
  metric: EntityChanges<Metric>;
  concept: EntityChanges<Concept>;
}

/**
 * The working copy of the entire context.
 *
 * The working copy can be queried, edited, and diffed, but in order to persist the
 * changes to a repository, you must call the `commit` method of the repository.
 *
 * Example:
 * ```ts
 * const workingCopy = await repository.checkout(repository.mainBranchName);
 * const tables = await workingCopy.repo('table').list();
 * const table = tables[0];
 * table.name = 'new-name';
 * await workingCopy.repo('table').upsert(table);
 * await repository.commit({
 *   workingCopy,
 *   branchName: repository.mainBranchName,
 * });
 * ```
 */
export interface ContextWorkingCopy {
  /**
   * Returns a repository for the given entity kind.
   *
   * @param kind - The kind of entity to get a repository for.
   */
  repo<K extends ContextEntity['kind']>(
    kind: K
  ): {
    list(): Promise<EntityOf<K>[]>;
    get(id: string): Promise<EntityOf<K> | null>;
    upsert(entity: EntityOf<K>): Promise<void>;
    remove(id: string): Promise<void>;
  };
  /**
   * Computes the diff from the current working copy to the passed working copy.
   *
   * @param to - The working copy to compute the diff to.
   */
  diff(to: ContextWorkingCopy): Promise<ContextWorkingCopyDiff>;
}
