import { z } from 'zod';
import { tableContextSchema } from './table-context.js';
import { metricSchema } from './metric.js';
import { columnContextSchema } from './column-context.js';
import { conceptSchema } from './concept.js';

export const contextEntitySchema = z.discriminatedUnion('kind', [
  tableContextSchema,
  columnContextSchema,
  metricSchema,
  conceptSchema,
]);

export type ContextEntity = z.infer<typeof contextEntitySchema>;
