import { z } from 'zod';

export const metricDefinitionSchema = z.object({
  /**
   * Unique identifier for the metric.
   */
  id: z.string(),
  /**
   * The name of the metric. For example, "Monthly Recurring Revenue",
   * "Customer Acquisition Cost".
   */
  name: z.string(),
  /**
   * The detailed description of the metric.
   */
  description: z.string().nullable(),
  /**
   * SQL-like formula or a natural language description of the metric calculation.
   */
  formula: z.string().nullable(),
  /**
   * For example: "Financial", "Marketing", "Sales", etc.
   */
  category: z.string().nullable(),
  /**
   * Tags used for categorization.
   */
  tags: z.array(z.string()),
  /**
   * Example SQL queries or natural language queries.
   */
  exampleQueries: z.array(z.string()),
  /**
   * The unit of measure of the metric. For example: "USD", "Count", "Percentage", etc.
   */
  unitOfMeasure: z.string().nullable(),
  /**
   * The fully qualified names of the source tables.
   */
  sourceTables: z.array(z.string()),
  /**
   * The fully qualified names of the source columns.
   */
  sourceColumns: z.array(z.string()),
});

export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
