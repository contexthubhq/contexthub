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
  repo<K extends EntityKind>(
    kind: K
  ): {
    /**
     * Lists all entities of the given kind.
     */
    list(): Promise<EntityOf<K>[]>;
    /**
     * Gets an entity by its id.
     *
     * @param id - The id of the entity to get.
     */
    get(id: string): Promise<EntityOf<K> | null>;
    /**
     * Upserts an entity.
     *
     * @param entity - The entity to upsert. If the id is present, the entity is updated.
     * If the id is not present, the entity is added.
     */
    upsert(entity: EntityOf<K>): Promise<void>;
    /**
     * Removes an entity by its id.
     *
     * @param id - The id of the entity to remove.
     */
    remove(id: string): Promise<void>;
  };
  /**
   * Computes the diff from the current working copy to the passed working copy.
   *
   * @param to - The working copy to compute the diff to.
   */
  diff(to: ContextWorkingCopy): Promise<ContextWorkingCopyDiff>;
}
