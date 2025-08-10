import { z } from 'zod';

const nonEmptyString = z.string().trim().min(1);

export const metricSchema = z.object({
  /**
   * Unique identifier for the metric.
   */
  id: nonEmptyString,
  /**
   * The name of the metric. For example, "Monthly Recurring Revenue",
   * "Customer Acquisition Cost".
   */
  name: nonEmptyString,
  /**
   * The detailed description of the metric.
   */
  description: nonEmptyString.nullable(),
  /**
   * SQL-like formula or a natural language description of the metric calculation.
   */
  formula: nonEmptyString.nullable(),
  /**
   * Tags used for categorization.
   */
  tags: z.array(nonEmptyString),
  /**
   * Example SQL queries or natural language queries.
   */
  exampleQueries: z.array(nonEmptyString),
  /**
   * The unit of measure of the metric. For example: "USD", "Count", "Percentage", etc.
   */
  unitOfMeasure: nonEmptyString.nullable(),
});

export type Metric = z.infer<typeof metricSchema>;

export const newMetricSchema = metricSchema.omit({
  id: true,
});

export type NewMetric = z.infer<typeof newMetricSchema>;
