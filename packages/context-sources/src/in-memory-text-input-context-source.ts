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

  constructor({ text, description }: InMemoryTextInputConfig) {
    this.text = text;
    this.description = description || '';
  }

  getTools(): Tool[] {
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
