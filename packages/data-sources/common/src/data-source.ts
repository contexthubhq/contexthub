export interface DataSource {
  id: string;
  name: string;
  testConnection(): Promise<boolean>;
}
