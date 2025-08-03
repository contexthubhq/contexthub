import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { getDataSourceConnections } from '../data-sources/get-data-source-connections';
import { TableAndColumnContextSection } from './table-and-column-context-section';

export default async function ContextPage() {
  const dataSourceConnections = await getDataSourceConnections();
  return (
    <div className="space-y-4">
      <PageHeader title="Context" />
      <TableAndColumnContextSection
        dataSourceConnections={dataSourceConnections}
      />
    </div>
  );
}
