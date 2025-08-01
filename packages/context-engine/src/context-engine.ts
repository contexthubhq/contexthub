import type { GenerateTableContextInput, TableContextResult } from './types.js';

/**
 * Main interface for the context generation engine
 */
export interface ContextEngine {
  /**
   * Generate context for a single table
   */
  generateTableContext(
    input: GenerateTableContextInput
  ): Promise<TableContextResult>;
}
