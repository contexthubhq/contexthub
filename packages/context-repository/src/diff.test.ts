import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryContextWorkingCopy } from './in-memory-context-working-copy.js';
import type { EntityOf } from './entities.js';

test('diff returns empty changes for identical working copies', async () => {
  const tables: EntityOf<'table'>[] = [
    {
      kind: 'table',
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
      description: 'base',
    },
  ];
  const base = new InMemoryContextWorkingCopy({
    table: tables,
  });
  const head = new InMemoryContextWorkingCopy({
    table: tables,
  });

  const diff = await base.diff(head);
  assert.equal(diff.table.added.length, 0);
  assert.equal(diff.table.removed.length, 0);
  assert.equal(diff.table.modified.length, 0);
  assert.equal(diff.column.added.length, 0);
  assert.equal(diff.column.removed.length, 0);
  assert.equal(diff.column.modified.length, 0);
  assert.equal(diff.metric.added.length, 0);
  assert.equal(diff.metric.removed.length, 0);
  assert.equal(diff.metric.modified.length, 0);
  assert.equal(diff.concept.added.length, 0);
  assert.equal(diff.concept.removed.length, 0);
  assert.equal(diff.concept.modified.length, 0);
});

test('diff detects added, removed, and modified entities across kinds', async () => {
  const base = new InMemoryContextWorkingCopy({
    column: [
      {
        kind: 'column',
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        columnName: 'c1',
        description: 'C1 base',
        exampleValues: [],
      },
    ],
    metric: [
      {
        kind: 'metric',
        id: 'm1',
        name: 'Metric 1',
        description: 'M1 base',
        tags: ['a'],
        formula: null,
        exampleQueries: [],
        unitOfMeasure: null,
      },
    ],
  });

  const head = new InMemoryContextWorkingCopy({
    column: [
      // Modify c1: change description
      {
        kind: 'column',
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        columnName: 'c1',
        description: 'C1 changed',
        exampleValues: [],
      },
    ],
    metric: [
      // Remove m1
      // Add m2
      {
        kind: 'metric',
        id: 'm2',
        name: 'Metric 2',
        description: 'M2 new',
        tags: ['b'],
        formula: null,
        exampleQueries: [],
        unitOfMeasure: null,
      },
    ],
  });

  const diff = await base.diff(head);
  // Not participating:
  assert.equal(diff.table.added.length, 0);
  assert.equal(diff.table.removed.length, 0);
  assert.equal(diff.table.modified.length, 0);
  assert.equal(diff.concept.added.length, 0);
  assert.equal(diff.concept.removed.length, 0);
  assert.equal(diff.concept.modified.length, 0);
  // Participating:
  // Column
  assert.equal(diff.column.added.length, 0);
  assert.equal(diff.column.removed.length, 0);
  assert.equal(diff.column.modified.length, 1);
  assert.equal(diff.column.modified[0].before.description, 'C1 base');
  assert.equal(diff.column.modified[0].after.description, 'C1 changed');
  // Metric
  assert.equal(diff.metric.added.length, 1);
  assert.equal(diff.metric.added[0].id, 'm2');
  assert.equal(diff.metric.removed.length, 1);
  assert.equal(diff.metric.removed[0].id, 'm1');
  assert.equal(diff.metric.modified.length, 0);
});
