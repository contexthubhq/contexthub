export type DataSourceConnection = {
  id: string;
  type: string;
  credentials: Record<string, string>;
  createdAt: Date;
  updatedAt: Date;
};
