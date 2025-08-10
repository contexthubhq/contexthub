import {
  ContextRepository,
  DatabaseContextRepository,
} from '@contexthub/context-repository';

export function getContextRepository(): ContextRepository {
  return new DatabaseContextRepository();
}
