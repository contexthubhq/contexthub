import type { Tool } from '@openai/agents';

export interface ContextSource {
  getTools(): Tool[];
}
