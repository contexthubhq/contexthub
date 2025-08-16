import { describe, before, after, afterEach, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTestDbContext,
  type TestDbContext,
} from '@contexthub/test-database';
import { DatabaseContextRepository } from './database-context-repository.js';

describe('DatabaseContextRepository', () => {
  let ctx: TestDbContext;

  before(async () => {
    ctx = await createTestDbContext();
  });

  after(async () => {
    await ctx.teardown();
  });
  afterEach(async () => {
    await ctx.reset();
    // The main branch and initial revision are created by the migrations,
    // so when we reset the database with `ctx.reset` they get wiped. This
    // is why we have to recreate them here.
    await ctx.prisma.contextRevision.create({
      data: {
        id: 'initial',
        content: {},
      },
    });
    await ctx.prisma.contextBranch.create({
      data: {
        name: 'main',
        revisionId: 'initial',
      },
    });
  });

  it('should create a new branch', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);
    await repository.createBranch({
      newBranchName: 'test',
      sourceBranchName: repository.mainBranchName,
    });
    const branches = await repository.listBranches();
    assert(branches.includes('test'));
  });

  it('lists the default main branch', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);
    const branches = await repository.listBranches();
    assert(branches.includes(repository.mainBranchName));
  });

  it('checkout returns an empty working copy for the initial main revision', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);
    const wc = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    assert.equal((await wc.listTables()).length, 0);
    assert.equal((await wc.listColumns()).length, 0);
    assert.equal((await wc.listMetrics()).length, 0);
    assert.equal((await wc.listConcepts()).length, 0);
  });

  it('commit persists working copy changes', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);
    const wc = await repository.checkout({
      branchName: repository.mainBranchName,
    });

    await wc.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.t1',
      description: 'Table 1',
    });

    const { revisionId } = await repository.commit({
      workingCopy: wc,
      branchName: repository.mainBranchName,
    });
    assert.ok(revisionId);

    const after = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    const tables = await after.listTables();
    assert.equal(tables.length, 1);
    assert.equal(tables[0].fullyQualifiedTableName, 'public.t1');
  });

  it('creating a branch clones the source state and further commits are isolated', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);

    // Commit something on main
    const mainWc = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    await mainWc.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.base',
      description: 'Base table',
    });
    await repository.commit({
      workingCopy: mainWc,
      branchName: repository.mainBranchName,
    });

    // Create feature from main and verify it sees base content
    await repository.createBranch({
      newBranchName: 'feature',
      sourceBranchName: repository.mainBranchName,
    });
    const featureWc = await repository.checkout({ branchName: 'feature' });
    assert.equal((await featureWc.listTables()).length, 1);

    // Commit only on feature
    await featureWc.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.feature_only',
      description: 'Feature table',
    });
    await repository.commit({ workingCopy: featureWc, branchName: 'feature' });

    // Main should not have the feature-only table
    const mainAfter = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    const mainTables = (await mainAfter.listTables()).map(
      (t) => t.fullyQualifiedTableName
    );
    assert.equal(mainTables.includes('public.feature_only'), false);
  });

  it('merge performs a fast-forward from source to target', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);

    await repository.createBranch({
      newBranchName: 'ff',
      sourceBranchName: repository.mainBranchName,
    });
    const ffWc = await repository.checkout({ branchName: 'ff' });
    await ffWc.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.ff',
      description: 'FF',
    });
    await repository.commit({ workingCopy: ffWc, branchName: 'ff' });

    // Merge ff -> main (main tip should be ancestor of ff tip)
    await repository.merge({
      sourceBranchName: 'ff',
      targetBranchName: repository.mainBranchName,
    });

    const mainAfter = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    const names = (await mainAfter.listTables()).map(
      (t) => t.fullyQualifiedTableName
    );
    assert.equal(names.includes('public.ff'), true);
  });

  it('merge rejects non-fast-forward merges', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);

    // Start by committing on main
    const mainWc1 = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    await mainWc1.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.m1',
      description: 'M1',
    });
    await repository.commit({
      workingCopy: mainWc1,
      branchName: repository.mainBranchName,
    });

    // Branch off at this point
    await repository.createBranch({
      newBranchName: 'diverge',
      sourceBranchName: repository.mainBranchName,
    });

    // Advance main further
    const mainWc2 = await repository.checkout({
      branchName: repository.mainBranchName,
    });
    await mainWc2.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.m2',
      description: 'M2',
    });
    await repository.commit({
      workingCopy: mainWc2,
      branchName: repository.mainBranchName,
    });

    // Advance diverge branch independently
    const divergeWc = await repository.checkout({ branchName: 'diverge' });
    await divergeWc.upsertTable({
      dataSourceConnectionId: 'ds1',
      fullyQualifiedTableName: 'public.d1',
      description: 'D1',
    });
    await repository.commit({ workingCopy: divergeWc, branchName: 'diverge' });

    // Attempt to merge diverge -> main should reject (not a fast-forward)
    await assert.rejects(
      repository.merge({
        sourceBranchName: 'diverge',
        targetBranchName: repository.mainBranchName,
      })
    );
  });

  it('checkout throws for an unknown branch', async () => {
    const repository = new DatabaseContextRepository(ctx.prisma);
    await assert.rejects(repository.checkout({ branchName: 'does-not-exist' }));
  });
});
