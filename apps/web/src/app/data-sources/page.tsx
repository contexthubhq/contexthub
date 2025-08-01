import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { ConnectDataSourceButton } from './connect-data-source-button';
import { getAvailableDataSources } from './get-available-data-sources';
import { getDataSourceConnections } from './get-data-source-connections';
import { connectDataSource } from './connect-data-source';
import { EmptySection } from '@/components/empty-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

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
      {dataSourceConnections.length === 0 ? (
        <EmptySection
          title="No data sources"
          description="Connect a data source to get started."
        >
          <div className="flex flex-row gap-2">
            <ConnectDataSourceButton
              availableDataSources={availableDataSources}
              action={connectDataSource}
            />
            <Button variant="outline" asChild>
              <Link
                href="https://github.com/contexthubhq/contexthub/tree/main/packages/data-sources"
                target="_blank"
              >
                See docs
              </Link>
            </Button>
          </div>
        </EmptySection>
      ) : (
        <div className="flex flex-col gap-4">
          {dataSourceConnections.map((connection) => (
            <div key={connection.id}>{connection.name}</div>
          ))}
        </div>
      )}
    </div>
  );
}
