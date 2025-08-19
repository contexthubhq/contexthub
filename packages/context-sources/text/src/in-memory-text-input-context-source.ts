import {
  type Tool,
  tool,
  registry,
  type ContextSource,
} from '@contexthub/context-sources-common';
import { z } from 'zod';

export interface InMemoryTextInputConfig {
  name: string;
  text: string;
  description?: string;
}

export class InMemoryTextInputContextSource implements ContextSource {
  private name: string;
  private text: string = '';
  private description: string = '';

  constructor({ name, text, description }: InMemoryTextInputConfig) {
    this.name = name;
    this.text = text;
    this.description = description || '';
  }

  getTools(): Tool[] {
    return [
      tool({
        name: `${this.name}.get_content`,
        description: this.description || 'Get the stored text content',
        parameters: z.object({}).strict(),
        execute: async () => {
          return this.text;
        },
      }),
    ];
  }
}

registry.register({
  type: 'text',
  factory: ({ configuration }: { configuration: Record<string, string> }) => {
    const name = configuration.name;
    const text = configuration.text;
    const description = configuration.description;

    if (!text) {
      throw new Error('Text is required');
    }
    if (!name) {
      throw new Error('Name is required');
    }

    return new InMemoryTextInputContextSource({
      name,
      text,
      description,
    });
  },
});
