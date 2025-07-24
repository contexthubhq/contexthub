import { DataSource } from '@contexthub/data-sources-common';

export interface DataSourceRegistration {
  /**
   * For example: "bigquery", "snowflake".
   */
  type: string;
  /**
   * A human-readable name for the data source. This is
   * used to identify the data source in the UI.
   */
  name: string;
  /**
   * A human-readable description of the data source. This is
   * used to describe the data source in the UI.
   */
  description?: string;
  /**
   * The fields required to connect to the data source.
   */
  credentialsFields: {
    name: string;
    description?: string;
    isRequired: boolean;
  }[];
  /**
   * A factory function that creates a new instance of the data source.
   */
  factory: ({
    credentials,
  }: {
    credentials: Record<string, string>;
  }) => DataSource;
}

class DataSourceRegistry {
  private sources = new Map<string, DataSourceRegistration>();

  register(registration: DataSourceRegistration) {
    if (this.sources.has(registration.type)) {
      throw new Error(`Data source ${registration.type} already registered`);
    }
    this.sources.set(registration.type, registration);
  }

  get({ type }: { type: string }): DataSourceRegistration | null {
    return this.sources.get(type) ?? null;
  }

  getAll(): DataSourceRegistration[] {
    return Array.from(this.sources.values());
  }

  createInstance({
    type,
    credentials,
  }: {
    type: string;
    credentials: Record<string, string>;
  }): DataSource {
    const registration = this.sources.get(type);
    if (!registration) {
      throw new Error(`Data source ${type} not found`);
    }

    return registration.factory({ credentials });
  }
}

export const registry = new DataSourceRegistry();
