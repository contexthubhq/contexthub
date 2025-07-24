export interface DataSource {
    id: string;
    name: string;
    testConnection(): Promise<boolean>;
}
//# sourceMappingURL=data-source.d.ts.map