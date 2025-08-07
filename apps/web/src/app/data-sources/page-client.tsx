'use client';

import { EmptySection } from '@/components/empty-section';
import { ConnectDataSourceButton } from './connect-data-source-button';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { useState } from 'react';
import { TableSelectionSection } from './table-selection-section';
import { EditDataSourceConnectionButton } from './edit-data-source-connection-button';
import { DataSourceConnection } from '@contexthub/data-sources-connections';

/**
 * Client component for the data sources page.
 */
export function PageClient({
  dataSourceConnections,
  availableDataSources,
  connectDataSource,
}: {
  dataSourceConnections: DataSourceConnection[];
  availableDataSources: DataSourceInfo[];
  connectDataSource: (
    data: ConnectDataSourceFormData
  ) => Promise<{ success: boolean; error?: string | undefined }>;
}) {
  return (
    <div>
      {dataSourceConnections.length === 0 ? (
        <EmptyPage
          availableDataSources={availableDataSources}
          connectDataSource={connectDataSource}
        />
      ) : (
        <PageWithConnections
          dataSourceConnections={dataSourceConnections}
          availableDataSources={availableDataSources}
          connectDataSource={connectDataSource}
        />
      )}
    </div>
  );
}

function PageWithConnections({
  dataSourceConnections,
  availableDataSources,
  connectDataSource,
}: {
  dataSourceConnections: DataSourceConnection[];
  availableDataSources: DataSourceInfo[];
  connectDataSource: (
    data: ConnectDataSourceFormData
  ) => Promise<{ success: boolean; error?: string | undefined }>;
}) {
  // Note: We expect there to be at least one data source connection if this component is rendered.
  const [selectedDataSourceConnectionId, setSelectedDataSourceConnectionId] =
    useState(dataSourceConnections[0].id);
  const selectedDataSourceConnection = dataSourceConnections.find(
    (connection) => connection.id === selectedDataSourceConnectionId
  )!;
  const selectedDataSourceInfo = availableDataSources.find(
    (dataSource) => dataSource.type === selectedDataSourceConnection.type
  )!;
  return (
    <div className="flex flex-col gap-8">
      <div className="flex max-w-xs flex-row gap-2">
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
        <EditDataSourceConnectionButton
          dataSourceConnection={selectedDataSourceConnection}
          dataSourceInfo={selectedDataSourceInfo}
          action={connectDataSource}
        />
      </div>
      <TableSelectionSection connectionId={selectedDataSourceConnectionId} />
    </div>
  );
}

function EmptyPage({
  availableDataSources,
  connectDataSource,
}: {
  availableDataSources: DataSourceInfo[];
  connectDataSource: (
    data: ConnectDataSourceFormData
  ) => Promise<{ success: boolean; error?: string | undefined }>;
}) {
  return (
    <EmptySection
      title="No data sources"
      description="Connect a data source to get started."
    >
      <div className="flex flex-row gap-2">
        <ConnectDataSourceButton
          availableDataSources={availableDataSources}
          action={connectDataSource}
          alignPopover="end"
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
  );
}
