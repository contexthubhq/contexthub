# Context Engine

## Overview

The context engine generates contextual information about database tables and columns using AI agents. It processes context sources iteratively and synthesizes the results into comprehensive descriptions.

## Interface

```typescript
interface ContextEngine {
  generateTableContext(input: GenerateTableContextInput): Promise<TableContextResult>;
}
```

### Input

```typescript
interface GenerateTableContextInput {
  table: TableDefinition;
  contextSources: ContextSource[];
}
```

### Output

```typescript
interface TableContextResult {
  table: TableDefinition;
  context: TableContext;
  confidence: number;
  sourcesUsed: string[];
}
```

## Usage with OpenAI Agents

The context engine uses the `@openai/agents` library to process context sources iteratively. Each context source provides tools that agents can use to gather information, and the results are accumulated and synthesized into a final description.

## Available Implementations

- `OpenAIAgentContextEngine`: Processes context sources using OpenAI agents with iterative accumulation 
