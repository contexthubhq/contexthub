'use server';

import { registry } from '@contexthub/data-sources-all';
import { createDataSourceConnection as _createDataSourceConnection } from '@contexthub/data-sources-connections';

export async function createDataSourceConnection({
  type,
  credentials,
}: {
  type: string;
  credentials: Record<string, string>;
}) {
  try {
    const dataSource = registry.createInstance({
      type,
      credentials,
    });
    const connectionIsOk = await dataSource.testConnection();
    if (!connectionIsOk) {
      throw new Error('Failed to connect to data source');
    }

    const result = await _createDataSourceConnection({
      type,
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
