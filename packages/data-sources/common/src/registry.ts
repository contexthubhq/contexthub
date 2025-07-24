import { DataSource } from '@contexthub/data-sources-common';

export interface DataSourceRegistration {
  id: string;
  name: string;
  description?: string;
  credentialsFields: {
    name: string;
    description?: string;
    isRequired: boolean;
  }[];
  factory: (credentials: Record<string, string>) => DataSource;
}

class DataSourceRegistry {
  private sources = new Map<string, DataSourceRegistration>();

  register(registration: DataSourceRegistration) {
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

  createInstance(id: string, credentials: Record<string, string>): DataSource {
    const registration = this.sources.get(id);
    if (!registration) {
      throw new Error(`Data source ${id} not found`);
    }

    return registration.factory(credentials);
  }
}

export const registry = new DataSourceRegistry();
