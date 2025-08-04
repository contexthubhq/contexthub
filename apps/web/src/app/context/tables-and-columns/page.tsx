import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { getDataSourceConnections } from '@/app/data-sources/get-data-source-connections';
import { PageClient } from './page-client';

export const dynamic = 'force-dynamic';

export default async function ContextPage() {
  const dataSourceConnections = await getDataSourceConnections();
  return (
    <div className="space-y-4">
      <PageHeader title="Table and column context" />
      <PageClient dataSourceConnections={dataSourceConnections} />
    </div>
  );
}
