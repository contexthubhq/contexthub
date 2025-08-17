import {
  PostgreSqlContainer,
  type StartedPostgreSqlContainer,
} from '@testcontainers/postgresql';

export type StartedPg = {
  container: StartedPostgreSqlContainer;
  url: string;
};

export async function startPostgres(): Promise<StartedPg> {
  const container = await new PostgreSqlContainer(
    'postgres:17.5-alpine'
  ).start();
  return {
    container,
    url: container.getConnectionUri(),
  };
}

const STOP_TIMEOUT_MS = 10_000;

export async function stopPostgres(pg: StartedPg) {
  await pg.container.stop({ timeout: STOP_TIMEOUT_MS });
}
