'use server';

import { revalidatePath } from 'next/cache';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { registry } from '@contexthub/data-sources-all';
import {
  createDataSourceConnection,
  updateDataSourceConnection,
} from '@contexthub/data-sources-connections';

/**
 * Server action to connect a data source.
 */
export async function connectDataSource({
  id,
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

    if (id) {
      await updateDataSourceConnection({
        id,
        name,
        credentials,
      });
    } else {
      await createDataSourceConnection({
        type,
        name,
        credentials,
      });
    }

    // Refresh the data sources page to show the new connection
    revalidatePath('/data-sources');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to create data source credentials:', error);

    return {
      success: false,
      error: 'Failed to connect to data source',
    };
  }
}
