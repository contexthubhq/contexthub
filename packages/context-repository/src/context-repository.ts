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
  }): Promise<void>;
  /**
   * Lists the available branches.
   */
  listBranches(): Promise<string[]>;
  /**
   * Creates a new branch from the source branch.
   */
  createBranch(params: {
    newBranchName: string;
    sourceBranchName: string;
  }): Promise<void>;
  /**
   * Merges a branch into the target branch.
   */
  merge(params: {
    sourceBranchName: string;
    targetBranchName: string;
  }): Promise<void>;
}
