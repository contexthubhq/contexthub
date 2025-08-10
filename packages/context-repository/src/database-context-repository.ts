import { ContextWorkingCopy } from './context-working-copy.js';
import { prisma } from '@contexthub/database';
import { z } from 'zod';
import { InMemoryContextWorkingCopy } from './in-memory-context-working-copy.js';
import { ContextRepository } from './context-repository.js';
import {
  columnContextSchema,
  conceptSchema,
  metricSchema,
  tableContextSchema,
} from '@contexthub/core';

const revisionContentSchema = z.object({
  table: z.array(tableContextSchema),
  column: z.array(columnContextSchema),
  metric: z.array(metricSchema),
  concept: z.array(conceptSchema),
});

export class DatabaseContextRepository implements ContextRepository {
  readonly mainBranchName = 'main';

  /**
   * Gets the tip revision of a branch.
   */
  private async getTipOfBranch({
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
    const { revisionId } = await this.getTipOfBranch({
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
    const content = revisionContentSchema.parse(revision.content);
    return new InMemoryContextWorkingCopy(content);
  }

  async commit({
    workingCopy,
    branchName,
  }: {
    workingCopy: ContextWorkingCopy;
    branchName: string;
  }): Promise<{ revisionId: string }> {
    const { revisionId } = await this.getTipOfBranch({ branchName });
    const [tables, columns, metrics, concepts] = await Promise.all([
      workingCopy.listTables(),
      workingCopy.listColumns(),
      workingCopy.listMetrics(),
      workingCopy.listConcepts(),
    ]);
    const content: z.infer<typeof revisionContentSchema> = {
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
    return { revisionId: newRevision.id };
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
    const { revisionId } = await this.getTipOfBranch({
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
    const { revisionId: sourceRevisionId } = await this.getTipOfBranch({
      branchName: sourceBranchName,
    });
    const { revisionId: targetRevisionId } = await this.getTipOfBranch({
      branchName: targetBranchName,
    });
    // Currently, we only allow fast-forward merges.
    // In a fast-forward merge, the tip of the target branch is an ancestor of the tip of the source branch.
    // Therefore, we can simply update the target branch to point to the tip of the source branch.
    // Example:
    // sourceBranch: A -> B -> C, the branch points to C.
    // targetBranch: A -> B, the branch points to B.
    // Now we check that the tip of the target branch (B) is an ancestor of the tip of the source branch (C).
    // After the merge, the target branch will be updated to the tip of the source branch:
    // targetBranch: A -> B -> C, the branch points to C.
    const isAncestor = await isAncestorOf({
      ancestorRevisionId: targetRevisionId,
      descendantRevisionId: sourceRevisionId,
    });
    if (!isAncestor) {
      throw new Error(
        `Only fast-forward merge is allowed. Tip of ${targetBranchName} is not an ancestor of ${sourceBranchName}.`
      );
    }
    await prisma.contextBranch.update({
      where: { name: targetBranchName },
      data: { revisionId: sourceRevisionId },
    });
  }
}

async function isAncestorOf({
  ancestorRevisionId,
  descendantRevisionId,
}: {
  ancestorRevisionId: string;
  descendantRevisionId: string;
}): Promise<boolean> {
  let currentRevisionId: string | null = descendantRevisionId;
  while (currentRevisionId !== null) {
    if (currentRevisionId === ancestorRevisionId) {
      return true;
    }
    const revision: { parentId: string | null } | null =
      await prisma.contextRevision.findUnique({
        where: { id: currentRevisionId },
        select: {
          parentId: true,
        },
      });
    if (!revision) {
      throw new Error(`Revision ${currentRevisionId} not found`);
    }
    currentRevisionId = revision.parentId;
  }
  return false;
}
