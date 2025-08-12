import type { ContextRepository } from './context-repository.js';
import { DatabaseContextRepository } from './database-context-repository.js';

/**
 * Central function to get the context repository.
 *
 * A user can later switch to a different repository implementation by
 * providing a different implementation of the `ContextRepository` interface.
 *
 * @returns The context repository.
 */
export function getContextRepository(): ContextRepository {
  return new DatabaseContextRepository();
}
