import { ContextWorkingCopy } from './context-working-copy.js';

export const MAIN_BRANCH_NAME = 'main';

export interface ContextRepository {
  /**
   * Gets the HEAD working copy of the branch.
   */
  checkout(params: { branchName: string }): Promise<ContextWorkingCopy>;
  /**
   * Commits the working copy to the target branch creating a new revision.
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
   * @param params - The parameters for the create branch operation.
   * @param params.newBranchName - The name of the new branch.
   * @param params.sourceBranchName - The name of the branch to branch from.
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
