import { z } from 'zod';

export const conceptDefinitionSchema = z.object({
  /**
   * Unique identifier for the concept.
   */
  id: z.string(),
  /**
   * The name of the concept. For example, "Customer",
   * "Product", "Order", "Transaction", etc.
   */
  name: z.string(),
  /**
   * The detailed description of the concept.
   */
  description: z.string().nullable(),
  /**
   * Alternative names for the concept, for example: ["Customer", "Client"].
   */
  synonyms: z.array(z.string()),
  /**
   * Tags used for categorization.
   */
  tags: z.array(z.string()),
  /**
   * Example values for the concept.
   */
  exampleValues: z.array(z.string()),
});

export type ConceptDefinition = z.infer<typeof conceptDefinitionSchema>;
