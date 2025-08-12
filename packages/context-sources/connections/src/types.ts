import { z } from 'zod';

export type ContextSourceConnection = {
  id: string;
  type: string;
  name: string;
  configuration: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};

export const configurationSchema = z.record(z.string(), z.string());
