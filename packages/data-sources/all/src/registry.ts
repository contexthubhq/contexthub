import { z } from 'zod';
import { DataSource } from '@contexthub/data-sources-common';

export interface DataSourceRegistration<CredentialsType = any> {
  id: string;
  name: string;
  description?: string;
  credentialsSchema: z.ZodSchema<CredentialsType>;
  factory: (credentials: CredentialsType) => DataSource;
}

class DataSourceRegistry {
  private sources = new Map<string, DataSourceRegistration>();

  register<TCredentials>(registration: DataSourceRegistration<TCredentials>) {
    if (this.sources.has(registration.id)) {
      throw new Error(`Data source ${registration.id} already registered`);
    }
    this.sources.set(registration.id, registration);
  }

  get(id: string): DataSourceRegistration | undefined {
    return this.sources.get(id);
  }

  getAll(): DataSourceRegistration[] {
    return Array.from(this.sources.values());
  }

  createInstance(id: string, credentials: unknown): DataSource {
    const registration = this.sources.get(id);
    if (!registration) {
      throw new Error(`Data source ${id} not found`);
    }

    // Validate credentials against schema
    const validatedCredentials =
      registration.credentialsSchema.parse(credentials);
    return registration.factory(validatedCredentials);
  }
}

export const registry = new DataSourceRegistry();
