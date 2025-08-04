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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { ConnectDataSourceForm } from './connect-data-source-form';
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDataSource(null);
  };

  const handleSuccess = () => {
    handleCloseModal();
    toast.success('Data source connected successfully');
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedDataSource && (
            <>
              <DialogHeader>
                <DialogTitle>Connect {selectedDataSource.name}</DialogTitle>
                <DialogDescription>
                  {selectedDataSource.description}
                </DialogDescription>
              </DialogHeader>
              <ConnectDataSourceForm
                dataSource={selectedDataSource}
                action={action}
                onSuccess={handleSuccess}
                onCancel={handleCloseModal}
                submitButtonText="Connect"
                loadingText="Connecting..."
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
