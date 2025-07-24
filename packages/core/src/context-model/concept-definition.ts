import { z } from 'zod';

export const conceptDefinitionSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  synonyms: z.array(z.string()),
  category: z.string().nullable(),
  tags: z.array(z.string()),
  exampleValues: z.array(z.string()),
  relatedConcepts: z.array(z.string()),
});

export type ConceptDefinition = z.infer<typeof conceptDefinitionSchema>;
