'use server';

import { registry } from '@contexthub/data-sources-all';
import type { DataSourceInfo, FieldInfo } from '@/types/data-source-info';

export async function getAvailableDataSources(): Promise<DataSourceInfo[]> {
  const dataSources = registry.getAll();

  return dataSources.map((ds) => {
    const fields: FieldInfo[] = ds.credentialsFields.map((field) => ({
      name: field.name,
      description: field.description,
      isRequired: field.isRequired,
    }));

    return {
      type: ds.type,
      name: ds.name,
      description: ds.description,
      fields,
    };
  });
}
