'use client';

import { EmptySection } from '@/components/empty-section';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import Link from 'next/link';
import { useState } from 'react';
import { TableAndColumnContextEdit } from './table-and-column-context-edit';

export function TableAndColumnContextSection({
  dataSourceConnections,
}: {
  dataSourceConnections: { id: string; name: string }[];
}) {
  if (dataSourceConnections.length === 0) {
    return <NoDataSources />;
  }

  // Note: We expect there to be at least one data source connection if this component is rendered.
  const [selectedDataSourceConnection, setSelectedDataSourceConnection] =
    useState(dataSourceConnections[0].id);
  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-sm">
        <Select
          value={selectedDataSourceConnection}
          onValueChange={setSelectedDataSourceConnection}
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
      <TableAndColumnContextEdit connectionId={selectedDataSourceConnection} />
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

function NoTablesSelected() {
  return (
    <EmptySection
      title="No tables selected"
      description="Select a table to get started."
    >
      <div className="flex flex-row gap-2">
        <Button variant="outline" asChild>
          <Link href="/data-sources">Select a table</Link>
        </Button>
      </div>
    </EmptySection>
  );
}
