'use client';

import { useState } from 'react';
import { ContextEditSection } from './context-edit-section';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EmptySection } from '@/components/empty-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

/**
 * Client component for the tables and columns context page.
 */
export function PageClient({
  dataSourceConnections,
}: {
  dataSourceConnections: { id: string; name: string }[];
}) {
  if (dataSourceConnections.length === 0) {
    return <EmptyPage />;
  }

  return <PageWithConnections dataSourceConnections={dataSourceConnections} />;
}

function PageWithConnections({
  dataSourceConnections,
}: {
  dataSourceConnections: { id: string; name: string }[];
}) {
  const [selectedDataSourceConnectionId, setSelectedDataSourceConnectionId] =
    useState(dataSourceConnections[0].id);

  const selectedDataSourceConnection = dataSourceConnections.find(
    (connection) => connection.id === selectedDataSourceConnectionId
  );

  if (!selectedDataSourceConnection) {
    // Fallback: render nothing or an error message if the selected connection is not found
    return (
      <div className="text-red-500">
        Selected data source connection not found.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-xs">
        <Select
          value={selectedDataSourceConnectionId}
          onValueChange={setSelectedDataSourceConnectionId}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {dataSourceConnections.map((connection) => (
              <SelectItem key={connection.id} value={connection.id}>
                {connection.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <ContextEditSection
        connectionId={selectedDataSourceConnectionId}
        connectionName={selectedDataSourceConnection.name}
      />
    </div>
  );
}

function EmptyPage() {
  return (
    <EmptySection
      title="No data sources connected"
      description="Connect a data source to get started."
    >
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link href="/data-sources">Connect a data source</Link>
        </Button>
      </div>
    </EmptySection>
  );
}
