export type DataSourceConnection = {
  id: string;
  type: string;
  name: string;
  credentials: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};
