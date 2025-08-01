'use server';

import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { registry } from '@contexthub/data-sources-all';
import { createDataSourceConnection } from '@contexthub/data-sources-connections';

export async function connectDataSource({
  type,
  name,
  credentials,
}: ConnectDataSourceFormData) {
  try {
    const dataSource = registry.createInstance({
      type,
      credentials,
    });
    const connectionIsOk = await dataSource.testConnection();
    if (!connectionIsOk) {
      throw new Error('Failed to connect to data source');
    }

    const result = await createDataSourceConnection({
      type,
      name,
      credentials,
    });

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('Failed to create data source credentials:', error);

    return {
      success: false,
      error: 'Failed to connect to data source',
    };
  }
}
