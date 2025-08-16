import { GenericContainer, StartedTestContainer, Wait } from 'testcontainers';

export type StartedPg = {
  container: StartedTestContainer;
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  url: string;
};

export async function startPostgres(): Promise<StartedPg> {
  const username = 'test';
  const password = 'test';
  const database = 'testdb';

  const container = await new GenericContainer('postgres:17.5-alpine')
    .withEnvironment({
      POSTGRES_USER: username,
      POSTGRES_PASSWORD: password,
      POSTGRES_DB: database,
    })
    .withExposedPorts(5432)
    .withWaitStrategy(
      Wait.forLogMessage('database system is ready to accept connections')
    )
    .start();

  const host = container.getHost();
  const port = container.getMappedPort(5432);
  const url = `postgresql://${username}:${password}@${host}:${port}/${database}?schema=public`;

  return { container, host, port, username, password, database, url };
}

export async function stopPostgres(pg: StartedPg) {
  await pg.container.stop({ timeout: 1000 });
}
