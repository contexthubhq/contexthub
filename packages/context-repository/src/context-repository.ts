import { ContextWorkingCopy } from './context-working-copy.js';

/**
 * A repository for storing context.
 *
 * The interface is structured like a version control system. The underlying implementation
 * can be a database, or Git, or any other system that allows for revisions and branches.
 */
export interface ContextRepository {
  readonly mainBranchName: string;
  /**
   * Gets a working copy of the tip revision of the branch.
   */
  checkout(params: { branchName: string }): Promise<ContextWorkingCopy>;
  /**
   * Commits the working copy to the target branch creating a new revision and updating
   * the branch to point to the new revision.
   */
  commit(params: {
    workingCopy: ContextWorkingCopy;
    branchName: string;
  }): Promise<{ revisionId: string }>;
  /**
   * Lists the available branches.
   */
  listBranches(): Promise<string[]>;
  /**
   * Creates a new branch from the source branch.
   *
   * @param newBranchName - The name of the new branch.
   * @param sourceBranchName - The name of the branch to branch from.
   */
  createBranch(params: {
    newBranchName: string;
    sourceBranchName: string;
  }): Promise<void>;
  /**
   * Merges a branch into the target branch.
   *
   * @param params - The parameters for the merge operation.
   * @param params.sourceBranchName - The name of the branch to merge from. For example,
   * agent's change proposals.
   * @param params.targetBranchName - The name of the branch to merge into. Most likely
   * the main branch.
   */
  merge(params: {
    sourceBranchName: string;
    targetBranchName: string;
  }): Promise<void>;
}
