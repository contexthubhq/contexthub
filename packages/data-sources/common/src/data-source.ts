export interface QueryResult {
  rows: any[];
}

export interface DataSource {
  testConnection(): Promise<boolean>;
  executeQuery(query: string): Promise<QueryResult>;
}
