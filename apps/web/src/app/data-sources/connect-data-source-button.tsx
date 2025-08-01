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
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DataSourceInfo } from '@/types/data-source-info';
import { DataSourceConnectionForm } from './data-source-connection-form';

export function ConnectDataSourceButton({
  availableDataSources,
}: {
  availableDataSources: DataSourceInfo[];
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
              </DialogHeader>
              <DataSourceConnectionForm
                dataSource={selectedDataSource}
                onClose={handleCloseModal}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
