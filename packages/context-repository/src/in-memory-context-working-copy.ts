import { ContextWorkingCopy } from './context-working-copy.js';
import {
  ColumnContext,
  Concept,
  Metric,
  NewConcept,
  NewMetric,
  TableContext,
} from '@contexthub/core';
import type {
  ColumnIdentifier,
  ConceptIdentifier,
  MetricIdentifier,
  TableIdentifier,
} from './context-working-copy.js';

export class InMemoryContextWorkingCopy implements ContextWorkingCopy {
  private tables: Map<string, TableContext> = new Map();
  private columns: Map<string, ColumnContext> = new Map();
  private metrics: Map<string, Metric> = new Map();
  private concepts: Map<string, Concept> = new Map();

  constructor(initialData?: {
    table?: TableContext[];
    column?: ColumnContext[];
    metric?: Metric[];
    concept?: Concept[];
  }) {
    for (const table of initialData?.table ?? []) {
      this.tables.set(getTableKey(table), table);
    }
    for (const column of initialData?.column ?? []) {
      this.columns.set(getColumnKey(column), column);
    }
    for (const metric of initialData?.metric ?? []) {
      this.metrics.set(metric.id, metric);
    }
    for (const concept of initialData?.concept ?? []) {
      this.concepts.set(concept.id, concept);
    }
  }

  async listTables(): Promise<TableContext[]> {
    return Array.from(this.tables.values());
  }

  async listColumns(): Promise<ColumnContext[]> {
    return Array.from(this.columns.values());
  }

  async listMetrics(): Promise<Metric[]> {
    return Array.from(this.metrics.values());
  }

  async listConcepts(): Promise<Concept[]> {
    return Array.from(this.concepts.values());
  }

  async getTable(table: TableIdentifier): Promise<TableContext | undefined> {
    return this.tables.get(getTableKey(table));
  }

  async getColumn(
    column: ColumnIdentifier
  ): Promise<ColumnContext | undefined> {
    return this.columns.get(getColumnKey(column));
  }

  async getMetric(metric: MetricIdentifier): Promise<Metric | undefined> {
    return this.metrics.get(metric.id);
  }

  async getConcept(concept: ConceptIdentifier): Promise<Concept | undefined> {
    return this.concepts.get(concept.id);
  }

  async upsertTable(table: TableContext): Promise<void> {
    this.tables.set(getTableKey(table), table);
  }

  async upsertColumn(column: ColumnContext): Promise<void> {
    this.columns.set(getColumnKey(column), column);
  }

  async createMetric(metric: NewMetric): Promise<MetricIdentifier> {
    const id = makeId();
    this.metrics.set(id, { ...metric, id });
    return { id };
  }

  async createConcept(concept: NewConcept): Promise<ConceptIdentifier> {
    const id = makeId();
    this.concepts.set(id, { ...concept, id });
    return { id };
  }

  async updateMetric(metric: Metric): Promise<void> {
    this.metrics.set(metric.id, metric);
  }

  async updateConcept(concept: Concept): Promise<void> {
    this.concepts.set(concept.id, concept);
  }

  async removeTable(table: TableIdentifier): Promise<void> {
    this.tables.delete(getTableKey(table));
  }

  async removeColumn(column: ColumnIdentifier): Promise<void> {
    this.columns.delete(getColumnKey(column));
  }

  async removeMetric(metric: MetricIdentifier): Promise<void> {
    this.metrics.delete(metric.id);
  }

  async removeConcept(concept: ConceptIdentifier): Promise<void> {
    this.concepts.delete(concept.id);
  }

  async diff(to: ContextWorkingCopy) {
    const [baseTables, baseColumns, baseMetrics, baseConcepts] =
      await Promise.all([
        this.listTables(),
        this.listColumns(),
        this.listMetrics(),
        this.listConcepts(),
      ]);

    const [headTables, headColumns, headMetrics, headConcepts] =
      await Promise.all([
        to.listTables(),
        to.listColumns(),
        to.listMetrics(),
        to.listConcepts(),
      ]);

    return {
      table: computeEntityChanges(baseTables, headTables, getTableKey),
      column: computeEntityChanges(baseColumns, headColumns, getColumnKey),
      metric: computeEntityChanges(baseMetrics, headMetrics, (m) => m.id),
      concept: computeEntityChanges(baseConcepts, headConcepts, (c) => c.id),
    };
  }
}

function makeId(): string {
  return crypto.randomUUID();
}

function getTableKey(table: TableIdentifier): string {
  return `${table.dataSourceConnectionId}:${table.fullyQualifiedTableName}`;
}

function getColumnKey(column: ColumnIdentifier): string {
  return `${column.dataSourceConnectionId}:${column.fullyQualifiedTableName}:${column.columnName}`;
}

function computeEntityChanges<T>(
  base: Array<T>,
  head: Array<T>,
  keyFn: (item: T) => string
): {
  added: Array<T>;
  removed: Array<T>;
  modified: Array<{ before: T; after: T }>;
} {
  const baseMap = new Map<string, T>();
  const headMap = new Map<string, T>();

  for (const item of base) baseMap.set(keyFn(item), item);
  for (const item of head) headMap.set(keyFn(item), item);

  const added: Array<T> = [];
  const removed: Array<T> = [];
  const modified: Array<{ before: T; after: T }> = [];

  for (const [key, headItem] of headMap) {
    if (!baseMap.has(key)) {
      added.push(headItem);
      continue;
    }
    const baseItem = baseMap.get(key)!;
    if (!deepEqual(baseItem as unknown as any, headItem as unknown as any)) {
      modified.push({ before: baseItem, after: headItem });
    }
  }

  for (const [key, baseItem] of baseMap) {
    if (!headMap.has(key)) {
      removed.push(baseItem);
    }
  }

  return { added, removed, modified };
}

function deepEqual(a: any, b: any): boolean {
  if (a === b) return true;
  if (a === null || b === null) return a === b;
  const typeA = typeof a;
  const typeB = typeof b;
  if (typeA !== typeB) return false;

  if (Array.isArray(a)) {
    if (!Array.isArray(b)) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i += 1) {
      if (!deepEqual(a[i], b[i])) return false;
    }
    return true;
  }

  if (typeA === 'object') {
    const aKeys = Object.keys(a).sort();
    const bKeys = Object.keys(b).sort();
    if (aKeys.length !== bKeys.length) return false;
    for (let i = 0; i < aKeys.length; i += 1) {
      if (aKeys[i] !== bKeys[i]) return false;
    }
    for (const key of aKeys) {
      if (!deepEqual(a[key], b[key])) return false;
    }
    return true;
  }

  return false;
}
