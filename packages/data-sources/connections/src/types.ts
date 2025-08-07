import z from 'zod';

export type DataSourceConnection = {
  id: string;
  type: string;
  name: string;
  credentials: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};

export type SelectedTable = {
  fullyQualifiedName: string;
};

export const credentialsSchema = z.record(z.string(), z.string());
