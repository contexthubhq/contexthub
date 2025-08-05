'use client';

import { CheckIcon, ChevronDown, ChevronsUpDownIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { ConnectDataSourceSheet } from './connect-data-source-sheet';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';

/**
 * The button to connect a data source.
 *
 * Opens a dialog to connect a data source.
 */
export function ConnectDataSourceButton({
  availableDataSources,
  action,
  alignPopover,
}: {
  availableDataSources: DataSourceInfo[];
  action: (data: ConnectDataSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
  alignPopover?: 'start' | 'end';
}) {
  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSourceInfo | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSelectOpen, setIsSelectOpen] = useState(false);

  const handleDataSourceSelect = (dataSource: DataSourceInfo) => {
    setSelectedDataSource(dataSource);
    setIsSheetOpen(true);
  };

  const handleSubmit = async (data: ConnectDataSourceFormData) => {
    const result = await action(data);
    if (result.success) {
      toast.success('Data source connected successfully');
    } else {
      toast.error(result.error ?? 'Unknown error');
    }
    setSelectedDataSource(null);
    setIsSheetOpen(false);
  };

  return (
    <>
      <Popover open={isSelectOpen} onOpenChange={setIsSelectOpen}>
        <PopoverTrigger asChild>
          <Button>
            Connect
            <ChevronDown className="h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0" align={alignPopover}>
          <Command>
            <CommandInput placeholder="Search data source..." />
            <CommandList>
              <CommandEmpty>No data source found.</CommandEmpty>
              <CommandGroup>
                {availableDataSources.map((dataSource) => (
                  <CommandItem
                    key={dataSource.type}
                    value={dataSource.type}
                    onSelect={() => handleDataSourceSelect(dataSource)}
                    className="cursor-pointer"
                  >
                    {dataSource.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedDataSource && (
        <ConnectDataSourceSheet
          dataSource={selectedDataSource}
          onSubmit={handleSubmit}
          open={isSheetOpen}
          onOpenChange={setIsSheetOpen}
          submitButtonText="Connect"
          loadingText="Connecting..."
        />
      )}
    </>
  );
}
