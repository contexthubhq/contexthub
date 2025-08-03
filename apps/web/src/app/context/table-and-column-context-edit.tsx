'use client';

import { useTablesQuery } from '@/api/use-tables-query';
import { TableTree } from '@/components/table-tree';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';

interface SelectTablesProps {
  connectionId: string;
}
export function TableAndColumnContextEdit({ connectionId }: SelectTablesProps) {
  const {
    data: tablesQueryResult,
    isLoading: isTablesQueryLoading,
    error: tablesQueryError,
  } = useTablesQuery({
    dataSourceConnectionId: connectionId,
  });
  const [highlightedTableId, setHighlightedTableId] = useState<string | null>(
    null
  );

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

  const highlightedTable = tablesQueryResult?.tables.find(
    (table) => table.fullyQualifiedTableName === highlightedTableId
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <ScrollArea className="h-96 w-full">
        {tablesQueryResult && (
          <TableTree
            tableTree={tablesQueryResult.tableTree}
            selectable={false}
            highlightable={true}
            highlightedTable={highlightedTableId ?? undefined}
            onHighlightChange={setHighlightedTableId}
          />
        )}
      </ScrollArea>
      <div className="col-span-2">
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold">
            {highlightedTable
              ? highlightedTable.tableName
              : 'No table selected'}
          </h2>
        </div>
      </div>
    </div>
  );
}
