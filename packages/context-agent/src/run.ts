import { getDataSourceConnectionsList } from '@contexthub/data-sources-connections';
import { getContextSourceConnectionsList } from '@contexthub/context-sources-connections';
import { ContextAgentRunner } from './context-agent-runner.js';
import { getContextRepository } from '@contexthub/context-repository';
import { OpenAIContextAgent } from './openai-context-agent.js';
import { registry as contextSourceRegistry } from '@contexthub/context-sources-all';

export async function run({ jobId }: { jobId: string }): Promise<void> {
  const repository = getContextRepository();
  const dataSourceConnections = await getDataSourceConnectionsList();
  const dataSourceConnectionIds = dataSourceConnections.map(
    (connection) => connection.id
  );
  const contextSourceConnections = await getContextSourceConnectionsList();
  const contextSources = contextSourceConnections.map((connection) => {
    const source = contextSourceRegistry.createInstance({
      type: connection.type,
      name: connection.name,
      configuration: connection.configuration,
    });
    return source;
  });
  const agent = new OpenAIContextAgent(contextSources, {
    model: process.env.OPENAI_MODEL ?? 'gpt-5',
  });
  const runner = new ContextAgentRunner({
    contextRepository: repository,
    contextAgent: agent,
    dataSourceConnectionIds,
  });
  await runner.run({ jobId });
}
