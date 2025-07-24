import { z } from 'zod';

export const metricDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  formula: z.string().nullable(),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  exampleQueries: z.array(z.string()),
  unitOfMeasure: z.string().nullable(),
});

export type MetricDefinition = z.infer<typeof metricDefinitionSchema>;
