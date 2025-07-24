'use server';

import { registry } from '@contexthub/data-sources-all';
import type { DataSourceInfo, FieldInfo } from '../common/data-source-info';

export async function getDataSources(): Promise<DataSourceInfo[]> {
  const dataSources = registry.getAll();

  return dataSources.map((ds) => {
    const fields: FieldInfo[] = [];
    for (const field of ds.credentialsFields) {
      fields.push({
        name: field.name,
        description: field.description,
        isRequired: field.isRequired,
      });
    }

    return {
      type: ds.type,
      name: ds.name,
      description: ds.description,
      fields,
    };
  });
}
