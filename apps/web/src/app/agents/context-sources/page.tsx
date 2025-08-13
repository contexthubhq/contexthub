import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { getAvailableContextSources } from './get-available-context-sources';
import { connectContextSource } from './connect-context-source';
import { NewConnectionsSection } from './new-connections-section';
import { getContextSourceConnections } from '../get-context-source-connections';
import { ExistingConnectionsSection } from './existing-connections-section';

export const dynamic = 'force-dynamic';

export default async function ContextSourcesPage() {
  const connections = await getContextSourceConnections();
  const availableContextSources = await getAvailableContextSources();
  return (
    <div className="space-y-4">
      <PageHeader title="Context sources" />
      <div className="flex flex-col gap-8">
        {connections.length > 0 && (
          <ExistingConnectionsSection connections={connections} />
        )}
        <NewConnectionsSection
          availableContextSources={availableContextSources}
          connectContextSource={connectContextSource}
        />
      </div>
    </div>
  );
}
