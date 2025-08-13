import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { getAvailableContextSources } from './get-available-context-sources';
import { connectContextSource } from './connect-context-source';
import { NewConnectionsSection } from './new-connections-section';

export const dynamic = 'force-dynamic';

export default async function ContextSourcesPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Context sources" />
      <NewConnectionsSection
        availableContextSources={await getAvailableContextSources()}
        connectContextSource={connectContextSource}
      />
    </div>
  );
}
