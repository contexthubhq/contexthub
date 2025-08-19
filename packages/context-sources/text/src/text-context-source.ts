import {
  type Tool,
  tool,
  registry,
  type ContextSource,
} from '@contexthub/context-sources-common';
import { z } from 'zod';

export interface TextContextSourceConfig {
  name: string;
  text: string;
  description?: string;
}

export class TextContextSource implements ContextSource {
  private name: string;
  private text: string = '';
  private description: string = '';

  constructor({ name, text, description }: TextContextSourceConfig) {
    this.name = name;
    this.text = text;
    this.description = description || '';
  }

  getTools(): Tool[] {
    return [
      tool({
        // OpenAI agents index tools by name.
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
  factory: ({
    name,
    configuration,
  }: {
    name: string;
    configuration: Record<string, string>;
  }) => {
    const text = configuration.text;
    const description = configuration.description;

    if (!text) {
      throw new Error('Text is required');
    }
    if (!name) {
      throw new Error('Name is required');
    }

    return new TextContextSource({
      name,
      text,
      description,
    });
  },
});
