'use client';

import { useState } from 'react';
import { EditContext } from './edit-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ContextSection({
  dataSourceConnections,
}: {
  dataSourceConnections: { id: string; name: string }[];
}) {
  // Note: We expect there to be at least one data source connection if this component is rendered.
  const [selectedDataSourceConnectionId, setSelectedDataSourceConnectionId] =
    useState(dataSourceConnections[0].id);

  const selectedDataSourceConnection = dataSourceConnections.find(
    (connection) => connection.id === selectedDataSourceConnectionId
  )!;

  return (
    <div className="flex flex-col gap-8">
      <div className="max-w-sm">
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
      <EditContext
        connectionId={selectedDataSourceConnectionId}
        connectionName={selectedDataSourceConnection.name}
      />
    </div>
  );
}
