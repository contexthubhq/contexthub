import { Tool } from '@openai/agents';

export interface ContextSource {
  create(input: any): Promise<void>;
  getTools(): Promise<Tool[]>;
}
