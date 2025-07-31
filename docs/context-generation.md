# Context Sources

## Overview

Context sources provide tools for AI agents to gather information about database tables and schemas. They are designed to work with the `@openai/agents` library.

## Interface

```typescript
interface ContextSource {
  create(input: any): Promise<void>;
  getTools(): Promise<Tool[]>;
}
```

### Methods

- `create(input)`: Initialize or configure the context source with input data
- `getTools()`: Return an array of OpenAI agent tools that can be used to extract context information

## Usage with OpenAI Agents

Context sources are designed to be used with the `@openai/agents` library. The `getTools()` method returns tools that agents can use to gather context information about database tables.

## Available Implementations

- `InMemoryTextInputContextSource`: Stores text content in memory and provides it as a tool


