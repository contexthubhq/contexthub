import type { GenerateTableContextInput, TableContextResult } from './types.js';
import type { ContextEngine } from './context-engine.js';
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
export class OpenAIAgentContextEngine implements ContextEngine {
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
    typeof OpenAIAgentContextEngine.tableContextAgentInputSchema,
    typeof OpenAIAgentContextEngine.tableContextAgentOutputSchema
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
      typeof OpenAIAgentContextEngine.tableContextAgentInputSchema,
      typeof OpenAIAgentContextEngine.tableContextAgentOutputSchema
    >({
      name: 'Data warehouse context synthesizer',
      instructions: `
You are a Data warehouse context synthesizer for structured data (warehouses, marts, BI).
You must create a new context for a given table and its columns that helps LLMs understand and accurately query the data.

The context should improve the correctness, clarity, and usefulness for LLM-based querying.

Guardrails:
- If changing the context doesn't meaningfully improve the context, do not change it.
- Only use information that is available from the tools, don't make up any information.
- Only generate context for the columns that are provided.

Definitions:
- column context describes semantics, examples, and business hints for a column.
- table context describes a table and how to use it.

You will be given the following inputs:
- The table definition
- The existing table context
- The existing column contexts
- The tools to use to get input for generating the context

Output the full new table context and column contexts. If nothing changed, just return the existing table and column contexts.
`,
      outputType: OpenAIAgentContextEngine.tableContextAgentOutputSchema,
      tools,
      model: this.config.model,
    });
  }
  async generateTableContext(
    input: GenerateTableContextInput
  ): Promise<TableContextResult> {
    // Run the agent using the run function
    const result = await run(this.tableContextAgent, 'Generate new context', {
      context: {
        dataSourceConnectionName: input.dataSourceConnectionName,
        tableDefinition: input.tableDefinition,
        columnDefinitions: input.columnDefinitions,
        existingTableContext: input.existingTableContext,
        existingColumnContexts: input.existingColumnContexts,
      },
    });
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
