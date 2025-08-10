import { TableContext } from '@contexthub/core';
import { InMemoryContextWorkingCopy } from './in-memory-context-working-copy.js';

describe('InMemoryContextWorkingCopy', () => {
  it('diff returns empty changes for identical working copies', async () => {
    const tables: TableContext[] = [
      {
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
    expect(diff.table.added.length).toBe(0);
    expect(diff.table.removed.length).toBe(0);
    expect(diff.table.modified.length).toBe(0);
    expect(diff.column.added.length).toBe(0);
    expect(diff.column.removed.length).toBe(0);
    expect(diff.column.modified.length).toBe(0);
    expect(diff.metric.added.length).toBe(0);
    expect(diff.metric.removed.length).toBe(0);
    expect(diff.metric.modified.length).toBe(0);
    expect(diff.concept.added.length).toBe(0);
    expect(diff.concept.removed.length).toBe(0);
    expect(diff.concept.modified.length).toBe(0);
  });

  it('diff detects added, removed, and modified entities across kinds', async () => {
    const base = new InMemoryContextWorkingCopy({
      column: [
        {
          dataSourceConnectionId: 'ds',
          fullyQualifiedTableName: 'public.t1',
          columnName: 'c1',
          description: 'C1 base',
          exampleValues: [],
        },
      ],
      metric: [
        {
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
    expect(diff.table.added.length).toBe(0);
    expect(diff.table.removed.length).toBe(0);
    expect(diff.table.modified.length).toBe(0);
    expect(diff.concept.added.length).toBe(0);
    expect(diff.concept.removed.length).toBe(0);
    expect(diff.concept.modified.length).toBe(0);
    // Participating:
    // Column
    expect(diff.column.added.length).toBe(0);
    expect(diff.column.removed.length).toBe(0);
    expect(diff.column.modified.length).toBe(1);
    expect(diff.column.modified[0].before.description).toBe('C1 base');
    expect(diff.column.modified[0].after.description).toBe('C1 changed');
    // Metric
    expect(diff.metric.added.length).toBe(1);
    expect(diff.metric.added[0].id).toBe('m2');
    expect(diff.metric.removed.length).toBe(1);
    expect(diff.metric.removed[0].id).toBe('m1');
    expect(diff.metric.modified.length).toBe(0);
  });

  it('adds tables', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    await workingCopy.upsertTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
      description: 'base',
    });
    const table = await workingCopy.getTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
    });
    expect(table?.description).toBe('base');
  });

  it('removes tables', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    await workingCopy.upsertTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
      description: 'base',
    });
    await workingCopy.removeTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
    });
    expect(
      await workingCopy.getTable({
        dataSourceConnectionId: 'ds',
        fullyQualifiedTableName: 'public.t1',
      })
    ).toBeUndefined();
  });
  it('updates tables', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    await workingCopy.upsertTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
      description: 'base',
    });
    await workingCopy.upsertTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
      description: 'changed',
    });
    const table = await workingCopy.getTable({
      dataSourceConnectionId: 'ds',
      fullyQualifiedTableName: 'public.t1',
    });
    expect(table?.description).toBe('changed');
  });

  it('adds metrics', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    const { id } = await workingCopy.createMetric({
      name: 'Metric 1',
      description: 'M1 base',
      formula: null,
      tags: [],
      exampleQueries: [],
      unitOfMeasure: null,
    });
    const metric = await workingCopy.getMetric({
      id,
    });
    expect(metric?.name).toBe('Metric 1');
    expect(metric?.description).toBe('M1 base');
  });

  it('removes metrics', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    const { id } = await workingCopy.createMetric({
      name: 'Metric 1',
      description: 'M1 base',
      formula: null,
      tags: [],
      exampleQueries: [],
      unitOfMeasure: null,
    });
    await workingCopy.removeMetric({
      id,
    });
    expect(
      await workingCopy.getMetric({
        id,
      })
    ).toBeUndefined();
  });

  it('updates metrics', async () => {
    const workingCopy = new InMemoryContextWorkingCopy();
    const { id } = await workingCopy.createMetric({
      name: 'Metric 1',
      description: 'M1 base',
      formula: null,
      tags: [],
      exampleQueries: [],
      unitOfMeasure: null,
    });
    await workingCopy.updateMetric({
      id,
      name: 'Metric 1',
      description: 'M1 changed',
      formula: null,
      tags: [],
      exampleQueries: [],
      unitOfMeasure: null,
    });
    const metric = await workingCopy.getMetric({
      id,
    });
    expect(metric?.name).toBe('Metric 1');
    expect(metric?.description).toBe('M1 changed');
  });
});
