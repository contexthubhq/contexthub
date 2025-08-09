import test from 'node:test';
import assert from 'node:assert/strict';
import { InMemoryContextWorkingCopy } from './in-memory-context-working-copy.js';
import type { EntityOf } from './entities.js';

function makeTable(
  params: Partial<EntityOf<'table'>> &
    Pick<
      EntityOf<'table'>,
      'dataSourceConnectionId' | 'fullyQualifiedTableName'
    >
): EntityOf<'table'> {
  return {
    description: null,
    ...params,
  } as EntityOf<'table'>;
}

function makeColumn(
  params: Partial<EntityOf<'column'>> &
    Pick<
      EntityOf<'column'>,
      'dataSourceConnectionId' | 'fullyQualifiedTableName' | 'columnName'
    >
): EntityOf<'column'> {
  return {
    description: null,
    exampleValues: [],
    ...params,
  } as EntityOf<'column'>;
}

function makeMetric(
  params: Partial<EntityOf<'metric'>> & Pick<EntityOf<'metric'>, 'id' | 'name'>
): EntityOf<'metric'> {
  return {
    description: null,
    formula: null,
    tags: [],
    exampleQueries: [],
    unitOfMeasure: null,
    ...params,
  } as EntityOf<'metric'>;
}

function makeConcept(
  params: Partial<EntityOf<'concept'>> &
    Pick<EntityOf<'concept'>, 'id' | 'name'>
): EntityOf<'concept'> {
  return {
    description: null,
    synonyms: [],
    tags: [],
    exampleValues: [],
    ...params,
  } as EntityOf<'concept'>;
}

test('diff returns empty changes for identical working copies', async () => {
  const base = new InMemoryContextWorkingCopy({
    table: [
      makeTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        description: 'base',
      }),
    ],
    column: [
      makeColumn({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        columnName: 'c1',
        description: 'd',
      }),
    ],
    metric: [makeMetric({ id: 'm1', name: 'Metric 1' })],
    concept: [makeConcept({ id: 'k1', name: 'Concept 1' })],
  });
  const head = new InMemoryContextWorkingCopy({
    table: [
      makeTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        description: 'base',
      }),
    ],
    column: [
      makeColumn({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        columnName: 'c1',
        description: 'd',
      }),
    ],
    metric: [makeMetric({ id: 'm1', name: 'Metric 1' })],
    concept: [makeConcept({ id: 'k1', name: 'Concept 1' })],
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
    table: [
      makeTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        description: 'T1 base',
      }),
    ],
    column: [
      makeColumn({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        columnName: 'c1',
        description: 'C1 base',
      }),
    ],
    metric: [
      makeMetric({
        id: 'm1',
        name: 'Metric 1',
        description: 'M1 base',
        tags: ['a'],
      }),
    ],
    concept: [
      makeConcept({
        id: 'k1',
        name: 'Concept 1',
        description: 'K1 base',
        tags: ['t'],
      }),
    ],
  });

  const head = new InMemoryContextWorkingCopy({
    table: [
      // Modified T1 (same id, different description)
      makeTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
        description: 'T1 changed',
      }),
      // Added T2
      makeTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t2',
        description: 'T2 new',
      }),
    ],
    column: [
      // C1 removed (present in base but not in head)
    ],
    metric: [
      // Modified M1 (same id, different tags)
      makeMetric({
        id: 'm1',
        name: 'Metric 1',
        description: 'M1 base',
        tags: ['a', 'b'],
      }),
      // Added M2
      makeMetric({ id: 'm2', name: 'Metric 2' }),
    ],
    concept: [
      // Modified K1
      makeConcept({
        id: 'k1',
        name: 'Concept 1',
        description: 'K1 changed',
        tags: ['t'],
      }),
    ],
  });

  const diff = await base.diff(head);

  // Tables
  assert.equal(diff.table.added.length, 1);
  assert.equal(diff.table.added[0]?.fullyQualifiedTableName, 'public.t2');
  assert.equal(diff.table.removed.length, 0);
  assert.equal(diff.table.modified.length, 1);
  assert.equal(diff.table.modified[0]?.before.description, 'T1 base');
  assert.equal(diff.table.modified[0]?.after.description, 'T1 changed');

  // Columns
  assert.equal(diff.column.added.length, 0);
  assert.equal(diff.column.removed.length, 1);
  assert.equal(diff.column.removed[0]?.columnName, 'c1');
  assert.equal(diff.column.modified.length, 0);

  // Metrics
  assert.equal(diff.metric.added.length, 1);
  assert.equal(diff.metric.added[0]?.id, 'm2');
  assert.equal(diff.metric.removed.length, 0);
  assert.equal(diff.metric.modified.length, 1);
  assert.equal(diff.metric.modified[0]?.before.tags.length, 1);
  assert.equal(diff.metric.modified[0]?.after.tags.length, 2);

  // Concepts
  assert.equal(diff.concept.added.length, 0);
  assert.equal(diff.concept.removed.length, 0);
  assert.equal(diff.concept.modified.length, 1);
  assert.equal(diff.concept.modified[0]?.before.description, 'K1 base');
  assert.equal(diff.concept.modified[0]?.after.description, 'K1 changed');
});
