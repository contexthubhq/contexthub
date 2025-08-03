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

  const highlightedTable = tablesQueryResult?.tables.find(
    (table) => table.fullyQualifiedTableName === highlightedTableId
  );

  if (!tablesQueryResult) {
    return <div>Loading...</div>;
  }

  if (tablesQueryResult.tableTreeSelectedOnly.catalogs.length === 0) {
    return <NoTablesSelected connectionName={connectionName} />;
  }

  return (
    <div className="grid grid-cols-3 gap-4">
      <ScrollArea className="h-96 w-full">
        <TableTree
          tableTree={tablesQueryResult.tableTreeSelectedOnly}
          selectable={false}
          highlightable={true}
          highlightedTable={highlightedTableId ?? undefined}
          onHighlightChange={setHighlightedTableId}
        />
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
