import { tool, Tool } from '@openai/agents';
import { ContextSource } from './context-source.js';
import z from 'zod';

export interface InMemoryTextInputConfig {
  text: string;
  description?: string;
}

export class InMemoryTextInputContextSource implements ContextSource {
  private text: string = '';
  private description: string = '';

  constructor(config?: InMemoryTextInputConfig) {
    if (config) {
      this.text = config.text;
      this.description = config.description || '';
    }
  }

  async create(input: InMemoryTextInputConfig): Promise<void> {
    this.text = input.text;
    this.description = input.description || '';
  }

  async getTools(): Promise<Tool[]> {
    return [
      tool({
        name: 'get_text_content',
        description: this.description || 'Get the stored text content',
        parameters: z.object({}).strict(),
        execute: async () => {
          return this.text;
        },
      }),
    ];
  }
}
