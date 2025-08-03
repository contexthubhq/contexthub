import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getDataSourceConnections } from '../data-sources/get-data-source-connections';
import { TableAndColumnContextSection } from './table-and-column-context-section';

export default async function ContextPage() {
  const dataSourceConnections = await getDataSourceConnections();
  return (
    <div className="space-y-4">
      <PageHeader title="Context" />
      <Tabs defaultValue="table-column">
        <TabsList>
          <TabsTrigger value="table-column">Table & column context</TabsTrigger>
          <TabsTrigger value="metrics">Metrics</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
        </TabsList>
        <TabsContent value="table-column">
          <div className="pt-4">
            <TableAndColumnContextSection
              dataSourceConnections={dataSourceConnections}
            />
          </div>
        </TabsContent>
        <TabsContent value="metrics">Metrics</TabsContent>
        <TabsContent value="concepts">Concepts</TabsContent>
      </Tabs>
    </div>
  );
}
