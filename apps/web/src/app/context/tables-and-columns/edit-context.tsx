'use client';

import { useTablesQuery } from '@/api/use-tables-query';
import { TableTree } from '@/components/table-tree';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { EmptySection } from '@/components/empty-section';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { EditTable } from './edit-table';

interface SelectTablesProps {
  connectionId: string;
  connectionName: string;
}

export function EditContext({
  connectionId,
  connectionName,
}: SelectTablesProps) {
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

  if (!tablesQueryResult) {
    return <div>Loading...</div>;
  }

  if (tablesQueryResult.tableTreeSelectedOnly.catalogs.length === 0) {
    return <NoTablesSelected connectionName={connectionName} />;
  }

  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-1 flex flex-col gap-4">
        <h3 className="text-md font-semibold">Tables</h3>
        <ScrollArea className="h-[calc(100vh-15rem)] w-full">
          <TableTree
            tableTree={tablesQueryResult.tableTreeSelectedOnly}
            selectable={false}
            highlightable={true}
            highlightedTable={highlightedTableId ?? undefined}
            onHighlightChange={setHighlightedTableId}
          />
        </ScrollArea>
      </div>
      <div className="col-span-3 border-l pl-4">
        {highlightedTableId ? (
          <EditTable
            connectionId={connectionId}
            fullyQualifiedTableName={highlightedTableId}
          />
        ) : (
          <div className="flex flex-col gap-2">
            <h3 className="text-md font-semibold">Select a table</h3>
            <p className="text-muted-foreground text-sm">
              Select a table from the list to edit the context.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function NoTablesSelected({ connectionName }: { connectionName: string }) {
  return (
    <EmptySection
      title="No tables selected"
      description={`Select which tables to include from the ${connectionName} data source or change the data source.`}
    >
      <div className="flex flex-row gap-2">
        <Button asChild>
          <Link href="/data-sources">Select tables</Link>
        </Button>
      </div>
    </EmptySection>
  );
}
