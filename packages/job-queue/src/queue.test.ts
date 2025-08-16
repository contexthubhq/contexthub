import { describe, before, after, afterEach, it } from 'node:test';
import assert from 'node:assert/strict';
import {
  createTestDbContext,
  type TestDbContext,
} from '@contexthub/test-database';
import { enqueue, claimOne, completeJob, failJob } from './index.js';

describe('JobQueue', () => {
  let ctx: TestDbContext;

  before(async () => {
    ctx = await createTestDbContext();
  });

  after(async () => {
    await ctx.teardown();
  });

  afterEach(async () => {
    await ctx.prisma.job.deleteMany();
  });

  it('enqueue inserts a job and returns its id', async () => {
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue: 'q1',
      payload: { a: 1 },
      maxAttempts: 3,
    });
    assert.ok(id);
  });

  it('claimOne returns the earliest runnable job', async () => {
    const now = new Date();
    const past = new Date(now.getTime() - 60_000);
    const future = new Date(now.getTime() + 60_000);
    const queue = 'q';

    const j1 = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { j: 1 },
      runAt: past,
      maxAttempts: 5,
    });
    await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { j: 2 },
      runAt: now,
      maxAttempts: 5,
    });
    await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { j: 3 },
      runAt: future,
      maxAttempts: 5,
    });

    const claimed1 = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(claimed1);
    assert.equal(claimed1?.id, j1.id);
  });

  it('claimOne respects visibility timeout', async () => {
    const queue = 'q';
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { v: 1 },
      maxAttempts: 3,
    });

    const first = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(first);
    assert.equal(first?.id, id);

    // Not visible yet, should not be claimed again with default visibility
    const none = await claimOne({ prisma: ctx.prisma, queue });
    assert.equal(none, null);
  });

  it('claimOne can re-acquire after visibility timeout', async () => {
    const queue = 'q';
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { v: 1 },
      maxAttempts: 3,
    });

    const first = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(first);
    assert.equal(first?.id, id);

    // Instead of sleeping and relying on host vs DB clock skew, move the lock into the past deterministically
    await ctx.prisma.job.update({
      where: { id },
      data: { lockedAt: new Date(0) },
    });

    const second = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(second);
    assert.equal(second?.id, id);
  });

  it('claimOne stops after reaching maxAttempts', async () => {
    const queue = 'q';
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { m: true },
      maxAttempts: 2,
    });

    const first = await claimOne({
      prisma: ctx.prisma,
      queue,
      visibilityMs: 0,
    });
    assert.ok(first);
    assert.equal(first?.id, id);

    const second = await claimOne({
      prisma: ctx.prisma,
      queue,
      visibilityMs: 0,
    });
    assert.ok(second);
    assert.equal(second?.id, id);

    const third = await claimOne({
      prisma: ctx.prisma,
      queue,
      visibilityMs: 0,
    });
    assert.equal(third, null);
  });

  it('failJob makes job available again and stores last error', async () => {
    const queue = 'q';
    const error = 'boom';
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { f: 1 },
      maxAttempts: 3,
    });

    const claimed = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(claimed);
    assert.equal(claimed?.id, id);

    await failJob({ prisma: ctx.prisma, id, error });

    const after = await ctx.prisma.job.findUnique({ where: { id } });
    assert.ok(after);
    assert.equal(after?.lastError, error);
  });

  it('completed jobs cannot be claimed', async () => {
    const queue = 'q';
    const { id } = await enqueue({
      prisma: ctx.prisma,
      queue,
      payload: { v: 1 },
      maxAttempts: 10,
    });

    const claimed = await claimOne({ prisma: ctx.prisma, queue });
    assert.ok(claimed);
    assert.equal(claimed?.id, id);

    await completeJob({ prisma: ctx.prisma, id });

    const none = await claimOne({ prisma: ctx.prisma, queue, visibilityMs: 0 });
    assert.equal(none, null);
  });

  it('claimOne is scoped by queue', async () => {
    const a = await enqueue({
      prisma: ctx.prisma,
      queue: 'A',
      payload: { v: 'a' },
      maxAttempts: 3,
    });
    const b = await enqueue({
      prisma: ctx.prisma,
      queue: 'B',
      payload: { v: 'b' },
      maxAttempts: 3,
    });

    const claimedB = await claimOne({ prisma: ctx.prisma, queue: 'B' });
    assert.ok(claimedB);
    assert.equal(claimedB?.id, b.id);

    const claimedA = await claimOne({ prisma: ctx.prisma, queue: 'A' });
    assert.ok(claimedA);
    assert.equal(claimedA?.id, a.id);
  });
});
