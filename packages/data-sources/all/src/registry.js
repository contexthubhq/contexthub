class DataSourceRegistry {
    sources = new Map();
    register(registration) {
        if (this.sources.has(registration.id)) {
            throw new Error(`Data source ${registration.id} already registered`);
        }
        this.sources.set(registration.id, registration);
    }
    get(id) {
        return this.sources.get(id);
    }
    getAll() {
        return Array.from(this.sources.values());
    }
    createInstance(id, credentials) {
        const registration = this.sources.get(id);
        if (!registration) {
            throw new Error(`Data source ${id} not found`);
        }
        // Validate credentials against schema
        const validatedCredentials = registration.credentialsSchema.parse(credentials);
        return registration.factory(validatedCredentials);
    }
}
export const registry = new DataSourceRegistry();
