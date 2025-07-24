# Data sources

This directory contains all data source implementations for ContextHub. Data sources allow users to connect to various external systems and services to provide context for AI applications.

## Architecture overview

The data sources system is built with a modular architecture:

- **`common/`** - Shared interfaces, types, and the data source registry
- **`all/`** - Aggregates all data sources for easy importing
- **Individual packages** (e.g., `snowflake/`, `bigquery/`) - Each data source implementation
- **Web app integration** - Automatically discovers and displays available data sources

## How to add a new data source

### 1. Create the package

Create a new package for your data source:

```
packages/data-sources/your-datasource/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts
│   └── your-datasource.ts
```

### 2. Implement the Data Source

Create `src/your-datasource.ts`:

```typescript
import { type DataSource, registry } from '@contexthub/data-sources-common';

export class YourDataSource implements DataSource {
  // Add implementation.
}

// Define the credentials fields your data source requires
const credentialsFields = [
  {
    name: 'apiKey',
    description: 'Your API Key',
    isRequired: true,
  },
  {
    name: 'endpoint',
    description: 'API Endpoint URL',
    isRequired: true,
  },
  {
    name: 'region',
    description: 'Service Region (optional)',
    isRequired: false,
  },
];

// Register your data source with the global registry
registry.register({
  id: 'your-datasource',
  name: 'Your DataSource',
  description: 'Connect to Your DataSource service',
  credentialsFields,
  factory: (credentials: Record<string, string>) =>
    new YourDataSource(credentials),
});
```

### 6. Add to the aggregated package

Update `packages/data-sources/all/package.json` to include your new data source:

```json
{
  "dependencies": {
    "@contexthub/data-sources-common": "workspace:*",
    "@contexthub/data-sources-snowflake": "workspace:*",
    "@contexthub/data-sources-bigquery": "workspace:*",
    "@contexthub/data-sources-your-datasource": "workspace:*"
  }
}
```

Update `packages/data-sources/all/src/index.ts`:

```typescript
export { SnowflakeDataSource } from '@contexthub/data-sources-snowflake';
export { BigQueryDataSource } from '@contexthub/data-sources-bigquery';
export { YourDataSource } from '@contexthub/data-sources-your-datasource';
```
