export interface DataSource {
  testConnection(): Promise<boolean>;
}
