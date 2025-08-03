'use client';

import { useTablesQuery } from '@/api/use-tables-query';
import { TableTree } from '@/components/table-tree';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SelectTablesProps {
  connectionId: string;
}
export function TableAndColumnContextEdit({ connectionId }: SelectTablesProps) {
  const {
    data: tablesQueryResult,
    isFetching: isTablesQueryFetching,
    isLoading: isTablesQueryLoading,
    error: tablesQueryError,
  } = useTablesQuery({
    dataSourceConnectionId: connectionId,
  });

  if (isTablesQueryLoading) {
    return <div>Loading...</div>;
  }

  // Error state
  if (tablesQueryError) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading tables: {tablesQueryError.message}
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <ScrollArea className="h-96 w-full">
      {tablesQueryResult && (
        <TableTree tableTree={tablesQueryResult.tableTree} selectable={false} />
      )}
    </ScrollArea>
  );
}
