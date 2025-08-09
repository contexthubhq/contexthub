import { ContextWorkingCopy } from './context-working-copy.js';
import { prisma } from '@contexthub/database';
import { z } from 'zod';
import { InMemoryContextWorkingCopy } from './in-memory-context-working-copy.js';
import { ContextRepository } from './context-repository.js';
import {
  columnContextInRepositorySchema,
  tableContextInRepositorySchema,
} from './entities.js';
import {
  conceptDefinitionSchema,
  metricDefinitionSchema,
} from '@contexthub/core';

const snapshotContentSchema = z.object({
  table: z.array(tableContextInRepositorySchema),
  column: z.array(columnContextInRepositorySchema),
  metric: z.array(metricDefinitionSchema),
  concept: z.array(conceptDefinitionSchema),
});

export class DatabaseContextRepository implements ContextRepository {
  async getRevision({
    branchName,
  }: {
    branchName: string;
  }): Promise<{ revisionId: string }> {
    const branch = await prisma.contextBranch.findUnique({
      where: {
        name: branchName,
      },
    });
    if (!branch) {
      throw new Error(`Branch ${branchName} not found`);
    }
    return { revisionId: branch.revisionId };
  }
  async checkout({
    branchName,
  }: {
    branchName: string;
  }): Promise<ContextWorkingCopy> {
    const { revisionId } = await this.getRevision({
      branchName,
    });
    const revision = await prisma.contextRevision.findUnique({
      where: {
        id: revisionId,
      },
    });
    if (!revision) {
      throw new Error(`Revision ${revisionId} not found`);
    }
    const content = snapshotContentSchema.parse(revision.content);
    return new InMemoryContextWorkingCopy(content);
  }
  async commit({
    workingCopy,
    branchName,
  }: {
    workingCopy: ContextWorkingCopy;
    branchName: string;
  }): Promise<void> {
    const { revisionId } = await this.getRevision({ branchName });
    const [tables, columns, metrics, concepts] = await Promise.all([
      workingCopy.repo('table').list(),
      workingCopy.repo('column').list(),
      workingCopy.repo('metric').list(),
      workingCopy.repo('concept').list(),
    ]);
    const content: z.infer<typeof snapshotContentSchema> = {
      table: tables,
      column: columns,
      metric: metrics,
      concept: concepts,
    };
    const newRevision = await prisma.contextRevision.create({
      data: { parentId: revisionId, content },
      select: { id: true },
    });
    await prisma.contextBranch.update({
      where: {
        name: branchName,
      },
      data: { revisionId: newRevision.id },
    });
  }
  async listBranches(): Promise<string[]> {
    const branches = await prisma.contextBranch.findMany();
    return branches.map((branch) => branch.name);
  }
  async createBranch({
    newBranchName,
    sourceBranchName,
  }: {
    newBranchName: string;
    sourceBranchName: string;
  }): Promise<void> {
    const { revisionId } = await this.getRevision({
      branchName: sourceBranchName,
    });
    await prisma.contextBranch.create({
      data: {
        name: newBranchName,
        revisionId,
      },
    });
  }
  async merge({
    sourceBranchName,
    targetBranchName,
  }: {
    sourceBranchName: string;
    targetBranchName: string;
  }): Promise<void> {
    // Only allow fast-forward merge.
    const { revisionId: sourceRevisionId } = await this.getRevision({
      branchName: sourceBranchName,
    });
    const { revisionId: targetRevisionId } = await this.getRevision({
      branchName: targetBranchName,
    });
    const sourceRevision = await prisma.contextRevision.findUnique({
      where: { id: sourceRevisionId },
      select: {
        parentId: true,
      },
    });
    if (sourceRevision?.parentId !== targetRevisionId) {
      throw new Error('Cannot merge non-fast-forward branch');
    }
    await prisma.contextBranch.update({
      where: { name: targetBranchName },
      data: { revisionId: sourceRevisionId },
    });
  }
}
