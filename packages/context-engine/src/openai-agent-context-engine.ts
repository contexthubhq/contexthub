import type { GenerateTableContextInput, TableContextResult } from './types.js';
import type { ContextEngine } from './context-engine.js';
import type { TableContext, TableDefinition } from '@contexthub/core';
import { Agent, run } from '@openai/agents';

/**
 * OpenAI Agent-based context engine that processes context sources iteratively
 */
export class OpenAIAgentContextEngine implements ContextEngine {
  async generateTableContext(
    input: GenerateTableContextInput
  ): Promise<TableContextResult> {
    let accumulatedContext = '';
    const sourcesUsed: string[] = [];

    // Process context sources iteratively
    for (const contextSource of input.contextSources) {
      try {
        // Get tools from current context source
        const tools = await contextSource.getTools();

        // Create agent with current source's tools
        const agent = new Agent({
          name: 'Data agent',
          instructions: this.generateTableContextPrompt(
            input.table,
            accumulatedContext
          ),
          tools: tools,
        });

        // Run the agent using the run function
        const result = await run(agent, [
          {
            role: 'user',
            content: `Please analyze the table "${input.table.tableName}" in schema "${input.table.tableSchema}" and provide context information using the available tools.`,
          },
        ]);

        const sourceContext = this.parseTableDescription(
          result.finalOutput || ''
        );

        if (sourceContext) {
          // Accumulate context from this source
          accumulatedContext +=
            (accumulatedContext ? '\n\n' : '') + sourceContext;
          sourcesUsed.push(contextSource.constructor.name);
        }
      } catch (error) {
        console.warn(
          `Failed to process context source ${contextSource.constructor.name}:`,
          error
        );
      }
    }

    // Final pass to synthesize all accumulated context
    const finalAgent = new Agent({
      name: 'Data agent',
      instructions: this.generateFinalSynthesisPrompt(
        input.table,
        accumulatedContext
      ),
    });

    const finalResult = await run(finalAgent, [
      {
        role: 'user',
        content: `Please synthesize all the accumulated context information into a comprehensive description of the table "${input.table.tableName}".`,
      },
    ]);

    const finalContext = this.parseTableDescription(
      finalResult.finalOutput || ''
    );

    // Parse the final response into table context
    const context: TableContext = {
      kind: 'table',
      description:
        finalContext || accumulatedContext || 'No context could be generated.',
    };

    return {
      table: input.table,
      context,
      sourcesUsed,
    };
  }

  /**
   * Generate prompt for individual context source processing
   */
  private generateTableContextPrompt(
    table: TableDefinition,
    previousContext: string
  ): string {
    return `You are a database expert. Based on the available tools and any previous context information, provide additional insights about what the table "${
      table.tableName
    }" in schema "${table.tableSchema}" is used for.

Table Information:
- Table Name: ${table.tableName}
- Schema: ${table.tableSchema}
- Catalog: ${table.tableCatalog}

${
  previousContext
    ? `Previous Context Information:
${previousContext}

`
    : ''
}Please use the available tools to gather context information and provide additional insights that explain:
1. What this table represents in business terms
2. What kind of data it stores
3. How it might be used in queries

Provide clear, concise additional information based on the tools available. If the tools don't provide relevant information, respond with "No additional context available from this source."`;
  }

  /**
   * Generate prompt for final synthesis of all accumulated context
   */
  private generateFinalSynthesisPrompt(
    table: TableDefinition,
    accumulatedContext: string
  ): string {
    return `You are a database expert. Synthesize the following accumulated context information into a clear, comprehensive description of what the table "${
      table.tableName
    }" in schema "${table.tableSchema}" is used for.

Table Information:
- Table Name: ${table.tableName}
- Schema: ${table.tableSchema}
- Catalog: ${table.tableCatalog}

Accumulated Context Information:
${accumulatedContext || 'No context information was gathered from any sources.'}

Please provide a final, synthesized description that explains:
1. What this table represents in business terms
2. What kind of data it stores
3. How it might be used in queries

Create a clear, well-structured description that combines all the available information. If no context was gathered, provide a generic description based on the table name and schema.`;
  }

  /**
   * Parse the agent response into a table description
   */
  private parseTableDescription(response: string): string | null {
    // Clean up the response
    const cleaned = response.trim();

    if (!cleaned) {
      return null;
    }

    // Remove any markdown formatting if present
    const withoutMarkdown = cleaned
      .replace(/^#+\s*/, '')
      .replace(/\*\*(.*?)\*\*/g, '$1');

    return withoutMarkdown;
  }
}
