import { ConnectContextSourceFormData } from '@/types/connect-context-source-form';
import { ContextSourceInfo } from '@/types/context-source-info';
import { TextContextSourceButton } from './connectors/text-context-source-button';

export function NewConnectionsSection({
  availableContextSources,
  connectContextSource,
}: {
  availableContextSources: ContextSourceInfo[];
  connectContextSource: (
    contextSource: ConnectContextSourceFormData
  ) => Promise<{
    success: boolean;
    error?: string;
  }>;
}) {
  const availableTypes = availableContextSources.map((cs) => cs.type);
  return (
    <div className="grid grid-cols-4 gap-4">
      <h2 className="col-span-4 text-lg font-semibold">Available sources</h2>
      {availableTypes.includes('text') && (
        <TextContextSourceButton onSubmit={connectContextSource} />
      )}
    </div>
  );
}
