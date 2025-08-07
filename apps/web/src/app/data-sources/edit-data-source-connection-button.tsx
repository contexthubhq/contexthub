'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { DataSourceInfo } from '@/types/data-source-info';
import { ConnectDataSourceFormData } from '@/types/connect-data-source-form';
import { ConnectDataSourceSheet } from './connect-data-source-sheet';
import { toast } from 'sonner';
import { DataSourceConnection } from '@contexthub/data-sources-connections';
import { Pencil } from 'lucide-react';

/**
 * The button to connect a data source.
 *
 * Opens a dialog to connect a data source.
 */
export function EditDataSourceConnectionButton({
  dataSourceInfo,
  dataSourceConnection,
  action,
}: {
  dataSourceInfo: DataSourceInfo;
  dataSourceConnection: DataSourceConnection;
  action: (data: ConnectDataSourceFormData) => Promise<{
    success: boolean;
    error?: string;
  }>;
}) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleSubmit = async (data: ConnectDataSourceFormData) => {
    const result = await action(data);
    if (result.success) {
      toast.success('Data source updated successfully');
    } else {
      toast.error(result.error ?? 'Unknown error');
    }
    setIsSheetOpen(false);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        onClick={() => setIsSheetOpen(true)}
      >
        <Pencil />
      </Button>
      <ConnectDataSourceSheet
        dataSource={dataSourceInfo}
        onSubmit={handleSubmit}
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        initialValues={dataSourceConnection}
        submitButtonText="Save"
        loadingText="Saving..."
      />
    </>
  );
}
