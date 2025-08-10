import {
  ContextRepository,
  DatabaseContextRepository,
} from '@contexthub/context-repository';

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
