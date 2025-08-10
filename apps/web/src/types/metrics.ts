import { metricSchema } from '@contexthub/core';
import z from 'zod';

export const newMetricSchema = metricSchema.omit({
  id: true,
});

export type NewMetric = z.infer<typeof newMetricSchema>;
