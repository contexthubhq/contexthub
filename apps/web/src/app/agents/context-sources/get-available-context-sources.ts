'use server';

import { registry } from '@contexthub/context-sources-all';
import type { ContextSourceInfo } from '@/types/context-source-info';

/**
 * Server function to get all available context sources in ContextHub.
 *
 * The user can connect to these context sources with the `ConnectContextSourceForm`.
 */
export async function getAvailableContextSources(): Promise<
  ContextSourceInfo[]
> {
  return registry.getAll();
}
