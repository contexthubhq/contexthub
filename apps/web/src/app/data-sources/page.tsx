import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ConnectDataSourceButton } from './connect-data-source-button';
import { getAvailableDataSources } from './get-available-data-sources';
import { getDataSourceConnections } from './get-data-source-connections';
import { connectDataSource } from './connect-data-source';
import { PageClient } from './page-client';

export const dynamic = 'force-dynamic';

export default async function DataSourcesPage() {
  const availableDataSources = await getAvailableDataSources();
  const dataSourceConnections = await getDataSourceConnections();

  return (
    <div className="space-y-4">
      <PageHeader title="Data sources">
        <ConnectDataSourceButton
          availableDataSources={availableDataSources}
          action={connectDataSource}
        />
      </PageHeader>
      <PageClient
        dataSourceConnections={dataSourceConnections}
        availableDataSources={availableDataSources}
        connectDataSource={connectDataSource}
      />
    </div>
  );
}
