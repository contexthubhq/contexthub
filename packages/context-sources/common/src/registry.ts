import type { ContextSource } from './context-source.js';

export interface ContextSourceRegistration {
  /**
   * For example: "text".
   */
  type: string;
  /**
   * A human-readable name for the context source used in the UI.
   */
  name: string;
  /**
   * Optional description for the context source.
   */
  description?: string;
  /**
   * The fields required to configure the context source.
   */
  configurationFields: {
    name: string;
    description?: string;
    isRequired: boolean;
  }[];
  /**
   * Factory that creates a new instance of the context source.
   */
  factory: ({
    configuration,
  }: {
    configuration: Record<string, string>;
  }) => ContextSource;
}

class ContextSourceRegistry {
  private sources = new Map<string, ContextSourceRegistration>();

  register(registration: ContextSourceRegistration) {
    if (this.sources.has(registration.type)) {
      throw new Error(`Context source ${registration.type} already registered`);
    }
    this.sources.set(registration.type, registration);
  }

  get({ type }: { type: string }): ContextSourceRegistration | null {
    return this.sources.get(type) ?? null;
  }

  getAll(): ContextSourceRegistration[] {
    return Array.from(this.sources.values());
  }

  createInstance({
    type,
    configuration,
  }: {
    type: string;
    configuration: Record<string, string>;
  }): ContextSource {
    const registration = this.sources.get(type);
    if (!registration) {
      throw new Error(`Context source ${type} not found`);
    }

    return registration.factory({ configuration });
  }
}

export const registry = new ContextSourceRegistry();
