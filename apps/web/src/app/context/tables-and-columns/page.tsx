import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { getDataSourceConnections } from '@/app/data-sources/get-data-source-connections';
import { EmptySection } from '@/components/empty-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ContextSection } from './context-section';

export default async function ContextPage() {
  const dataSourceConnections = await getDataSourceConnections();
  return (
    <div className="space-y-4">
      <PageHeader title="Table and column context" />
      {dataSourceConnections.length === 0 ? (
        <NoDataSources />
      ) : (
        <ContextSection dataSourceConnections={dataSourceConnections} />
      )}
    </div>
  );
}

function NoDataSources() {
  return (
    <EmptySection
      title="No data sources connected"
      description="Connect a data source to get started."
    >
      <div className="flex flex-row gap-2">
        <Button variant="outline" asChild>
          <Link href="/data-sources">Connect a data source</Link>
        </Button>
      </div>
    </EmptySection>
  );
}
