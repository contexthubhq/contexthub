import type {
  ContextAgent,
  GenerateTableContextInput,
  TableContextResult,
} from './context-agent.js';
import {
  columnContextSchema,
  columnDefinitionSchema,
  tableContextSchema,
  tableDefinitionSchema,
} from '@contexthub/core';
import { Agent, run, Tool } from '@openai/agents';
import z from 'zod';
import { ContextSource } from '@contexthub/context-sources-all';

/**
 * OpenAI Agent-based context engine that processes context sources iteratively
 */
export class OpenAIContextAgent implements ContextAgent {
  private static tableContextAgentOutputSchema = z.object({
    newTableContext: tableContextSchema.omit({
      dataSourceConnectionId: true,
      fullyQualifiedTableName: true,
    }),
    newColumnContexts: z.array(
      columnContextSchema.omit({
        dataSourceConnectionId: true,
        fullyQualifiedTableName: true,
      })
    ),
  });
  private static tableContextAgentInputSchema = z.object({
    dataSourceConnectionId: z.string(),
    dataSourceConnectionName: z.string(),
    tableDefinitionSchema: tableDefinitionSchema,
    columnDefinitions: z.array(columnDefinitionSchema),
    existingTableContext: tableContextSchema,
    existingColumnContexts: z.array(columnContextSchema),
  });
  private tableContextAgent: Agent<
    typeof OpenAIContextAgent.tableContextAgentInputSchema,
    typeof OpenAIContextAgent.tableContextAgentOutputSchema
  >;
  constructor(
    private readonly contextSources: ContextSource[],
    private readonly config: { model: string }
  ) {
    // Get tools from current context source
    const tools: Tool[] = this.contextSources.flatMap((source) =>
      source.getTools()
    );
    // Create agent with current source's tools
    this.tableContextAgent = new Agent<
      typeof OpenAIContextAgent.tableContextAgentInputSchema,
      typeof OpenAIContextAgent.tableContextAgentOutputSchema
    >({
      name: 'Data warehouse context synthesizer',
      instructions: `
You are a Data warehouse context synthesizer for structured data (warehouses, marts, BI).
You should attempt to create a new context for a given table and its columns that helps LLMs understand and accurately query the data.

The context should improve the correctness, clarity, and usefulness for LLM-based querying. If the context is not helpful, you should return the existing table and column contexts.

Guardrails:
- If changing the context doesn't meaningfully improve the context, do not change it.
- Only use information that is available from the tools, don't make up any information.
- If the tools don't provide meaningful information, do not change the context.
- Only generate context for the columns that are provided.

Definitions:
- column context describes semantics, examples, and business hints for a column.
- table context describes a table and how to use it.

You will be given the following inputs:
- The table definition. This will have identifying information for the table. This identifying information should be used to find relevant information in the tools.
- The column definitions. This will have identifying information for the columns. This identifying information should be used to find relevant information in the tools.
- The existing table context
- The existing column contexts
- The tools to use to get input for generating the context

Output the full new table context and column contexts. If nothing changed, just return the existing table and column contexts.
`,
      outputType: OpenAIContextAgent.tableContextAgentOutputSchema,
      tools,
      model: this.config.model,
    });
  }
  async generateTableContext(
    input: GenerateTableContextInput
  ): Promise<TableContextResult> {
    const prompt = `
Generate a new context using the following inputs (JSON format):

${JSON.stringify(input, null, 2)}
`;
    const result = await run(this.tableContextAgent, prompt);
    if (!result.finalOutput) {
      throw new Error('No output from agent');
    }

    return {
      newTableContext: {
        ...result.finalOutput.newTableContext,
        dataSourceConnectionId: input.dataSourceConnectionId,
        fullyQualifiedTableName: input.tableDefinition.fullyQualifiedTableName,
      },
      newColumnContexts: result.finalOutput.newColumnContexts.map(
        (columnContext) => ({
          ...columnContext,
          dataSourceConnectionId: input.dataSourceConnectionId,
          fullyQualifiedTableName:
            input.tableDefinition.fullyQualifiedTableName,
        })
      ),
    };
  }
}
