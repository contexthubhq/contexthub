'use client';

import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { ConnectDataSourceSheet } from './connect-data-source-sheet';
import { toast } from 'sonner';

/**
 * The button to connect a data source.
 *
 * Opens a dialog to connect a data source.
 */
export function ConnectDataSourceButton({
  availableDataSources,
  action,
}: {
  availableDataSources: DataSourceInfo[];
  action: (data: ConnectDataSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}) {
  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSourceInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDataSourceSelect = (dataSource: DataSourceInfo) => {
    setSelectedDataSource(dataSource);
    setIsModalOpen(true);
  };

  const handleSubmit = async (data: ConnectDataSourceFormData) => {
    const result = await action(data);
    if (result.success) {
      toast.success('Data source connected successfully');
    } else {
      toast.error(result.error ?? 'Unknown error');
    }
    setSelectedDataSource(null);
    setIsModalOpen(false);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            Connect
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {availableDataSources.map((dataSource) => (
            <DropdownMenuItem
              key={dataSource.type}
              onClick={() => handleDataSourceSelect(dataSource)}
              className="cursor-pointer"
            >
              {dataSource.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      {selectedDataSource && (
        <ConnectDataSourceSheet
          dataSource={selectedDataSource}
          onSubmit={handleSubmit}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          submitButtonText="Connect"
          loadingText="Connecting..."
        />
      )}
    </>
  );
}
