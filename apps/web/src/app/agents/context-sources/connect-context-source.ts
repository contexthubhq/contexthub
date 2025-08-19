'use server';

import { revalidatePath } from 'next/cache';
import { registry } from '@contexthub/context-sources-all';
import { createContextSourceConnection } from '@contexthub/context-sources-connections';
import { ConnectContextSourceFormData } from '@/types/connect-context-source-form';

/**
 * Server action to connect a context source.
 */
export async function connectContextSource({
  type,
  name,
  configuration,
}: ConnectContextSourceFormData) {
  try {
    // Make sure we can create an instance before saving.
    registry.createInstance({
      type,
      name,
      configuration,
    });
  } catch (error) {
    console.error('Failed to validate context source:', error);
    return {
      success: false,
      error: 'Failed to validate context source',
    };
  }

  try {
    await createContextSourceConnection({
      type,
      name,
      configuration,
    });

    revalidatePath('/agents/context-sources');

    return {
      success: true,
    };
  } catch (error) {
    console.error('Failed to create context source connection:', error);

    return {
      success: false,
      error: 'Failed to connect to context source connection.',
    };
  }
}
