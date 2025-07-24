import { z } from 'zod';
import { DataSource } from '@contexthub/data-sources-common';
export interface DataSourceRegistration<CredentialsType = any> {
    id: string;
    name: string;
    description?: string;
    credentialsSchema: z.ZodSchema<CredentialsType>;
    factory: (credentials: CredentialsType) => DataSource;
}
declare class DataSourceRegistry {
    private sources;
    register<TCredentials>(registration: DataSourceRegistration<TCredentials>): void;
    get(id: string): DataSourceRegistration | undefined;
    getAll(): DataSourceRegistration[];
    createInstance(id: string, credentials: unknown): DataSource;
}
export declare const registry: DataSourceRegistry;
export {};
//# sourceMappingURL=registry.d.ts.map