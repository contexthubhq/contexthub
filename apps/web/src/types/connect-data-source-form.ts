import { z } from 'zod';

export const connectDataSourceFormSchema = z.object({
  type: z.string().min(1),
  credentials: z.record(z.string().min(1), z.string().min(1)),
});

export type ConnectDataSourceFormData = z.infer<
  typeof connectDataSourceFormSchema
>;
