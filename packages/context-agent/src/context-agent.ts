import type {
  TableDefinition,
  ColumnDefinition,
  TableContext,
  ColumnContext,
} from '@contexthub/core';

/**
 * Input for generating table context
 */
export interface GenerateTableContextInput {
  /**
   * The id of the data source connection this context is associated with.
   */
  dataSourceConnectionId: string;
  /**
   * The name of the data source connection this context is associated with.
   * This can be used to identify the data source in question when using context sources.
   */
  dataSourceConnectionName: string;
  /**
   * The table definition to generate context for
   */
  tableDefinition: TableDefinition;
  /**
   * The columns to generate context for.
   */
  columnDefinitions: ColumnDefinition[];
  /**
   * Existing table context to use as a starting point.
   */
  existingTableContext: TableContext | null;
  /**
   * Existing column context to use as a starting point.
   */
  existingColumnContexts: ColumnContext[];
}

/**
 * Result of table context generation
 */
export interface TableContextResult {
  /**
   * Generated table context
   */
  newTableContext: TableContext;
  /**
   * Generated column contexts
   */
  newColumnContexts: ColumnContext[];
}

export interface ContextAgent {
  /**
   * Generate context for a single table
   */
  generateTableContext(
    input: GenerateTableContextInput
  ): Promise<TableContextResult>;
}
