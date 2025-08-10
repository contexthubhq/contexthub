import {
  ColumnContext,
  Concept,
  Metric,
  NewConcept,
  NewMetric,
  TableContext,
} from '@contexthub/core';

type ContextEntity = TableContext | ColumnContext | Metric | Concept;

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

export type TableIdentifier = {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
};

export type ColumnIdentifier = {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
  columnName: string;
};

export type MetricIdentifier = {
  id: string;
};

export type ConceptIdentifier = {
  id: string;
};

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
  // List
  listTables(): Promise<TableContext[]>;
  listColumns(): Promise<ColumnContext[]>;
  listMetrics(): Promise<Metric[]>;
  listConcepts(): Promise<Concept[]>;

  // Get
  getTable(table: TableIdentifier): Promise<TableContext | undefined>;
  getColumn(column: ColumnIdentifier): Promise<ColumnContext | undefined>;
  getMetric(metric: MetricIdentifier): Promise<Metric | undefined>;
  getConcept(concept: ConceptIdentifier): Promise<Concept | undefined>;

  // Upsert
  upsertTable(table: TableContext): Promise<void>;
  upsertColumn(column: ColumnContext): Promise<void>;

  createMetric(metric: NewMetric): Promise<MetricIdentifier>;
  createConcept(concept: NewConcept): Promise<ConceptIdentifier>;
  updateMetric(metric: Metric): Promise<void>;
  updateConcept(concept: Concept): Promise<void>;

  // Remove
  removeTable(table: TableIdentifier): Promise<void>;
  removeColumn(column: ColumnIdentifier): Promise<void>;
  removeMetric(metric: MetricIdentifier): Promise<void>;
  removeConcept(concept: ConceptIdentifier): Promise<void>;

  /**
   * Computes the diff from the current working copy to the passed working copy.
   *
   * @param to - The working copy to compute the diff to.
   */
  diff(to: ContextWorkingCopy): Promise<ContextWorkingCopyDiff>;
}
