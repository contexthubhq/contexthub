import {
  type Tool,
  tool,
  registry,
  type ContextSource,
} from '@contexthub/context-sources-common';
import { z } from 'zod';

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

const configurationFields = [
  { name: 'text', isRequired: true },
  { name: 'description', isRequired: false },
];

registry.register({
  type: 'text',
  name: 'Text',
  description: 'Simple static text provided at configuration time',
  configurationFields,
  factory: ({ configuration }: { configuration: Record<string, string> }) => {
    const text = configuration.text;
    const description = configuration.description;

    if (!text) {
      throw new Error('Text is required');
    }

    return new InMemoryTextInputContextSource({
      text,
      description,
    });
  },
});
