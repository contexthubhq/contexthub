import type {
  TableDefinition,
  ColumnDefinition,
  TableContext,
  ColumnContext,
} from '@contexthub/core';
import type { ContextSource } from '@contexthub/context-sources';

/**
 * Input for generating table context
 */
export interface GenerateTableContextInput {
  /**
   * The table definition to generate context for
   */
  table: TableDefinition;

  /**
   * List of context sources to use for inference
   */
  contextSources: ContextSource[];
}

/**
 * Input for generating column context
 */
export interface GenerateColumnContextInput {
  /**
   * The column definition to generate context for
   */
  column: ColumnDefinition;

  /**
   * The table this column belongs to
   */
  table: TableDefinition;

  /**
   * List of context sources to use for inference
   */
  contextSources: ContextSource[];
}

/**
 * Result of table context generation
 */
export interface TableContextResult {
  /**
   * The original table definition
   */
  table: TableDefinition;

  /**
   * Generated table context
   */
  context: TableContext;

  /**
   * Confidence score for the generated context (0-1)
   */
  confidence: number;

  /**
   * Sources used to generate this context
   */
  sourcesUsed: string[];
}

/**
 * Result of column context generation
 */
export interface ColumnContextResult {
  /**
   * The original column definition
   */
  column: ColumnDefinition;

  /**
   * Generated column context
   */
  context: ColumnContext;

  /**
   * Confidence score for the generated context (0-1)
   */
  confidence: number;
}
