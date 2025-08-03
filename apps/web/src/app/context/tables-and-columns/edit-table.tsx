'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { useTableDetailsQuery } from '@/api/use-table-details-query';
import { ColumnMetadata } from '@contexthub/core';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export function EditTable({
  connectionId,
  fullyQualifiedTableName,
}: {
  connectionId: string;
  fullyQualifiedTableName: string;
}) {
  const {
    data: tableDetailsQueryResult,
    isLoading: isTableDetailsQueryLoading,
    error: tableDetailsQueryError,
  } = useTableDetailsQuery({
    dataSourceConnectionId: connectionId,
    fullyQualifiedTableName,
  });

  if (isTableDetailsQueryLoading) {
    return <div>Loading...</div>;
  }

  if (tableDetailsQueryError) {
    return (
      <Alert variant="destructive" className="max-w-md">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Error loading table details: {tableDetailsQueryError.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (!tableDetailsQueryResult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-md font-semibold">
          {tableDetailsQueryResult.table.tableName}
        </h2>
        <p className="text-muted-foreground text-xs">
          {tableDetailsQueryResult.table.fullyQualifiedTableName}
        </p>
      </div>
      <p className="text-muted-foreground text-sm">
        {tableDetailsQueryResult.table.description ?? ''}
      </p>
      <div className="flex flex-col gap-2">
        <Columns columns={tableDetailsQueryResult.columns} />
      </div>
    </div>
  );
}

function Columns({ columns }: { columns: ColumnMetadata[] }) {
  const orderedColumns = columns.sort(
    (a, b) => a.ordinalPosition - b.ordinalPosition
  );
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold">Columns ({columns.length})</h4>
      <Table className="text-xs">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Name</TableHead>
            <TableHead className="w-[100px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Example values</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedColumns.map((column) => (
            <TableRow key={column.columnName}>
              <TableCell className="w-[100px]">{column.columnName}</TableCell>
              <TableCell className="text-muted-foreground w-[100px]">
                {column.dataType}
              </TableCell>
              <TableCell className="text-muted-foreground">
                <EditableDescription description={column.description} />
              </TableCell>
              <TableCell className="text-muted-foreground">
                <EditableExampleValues exampleValues={column.exampleValues} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function EditableDescription({ description }: { description: string | null }) {
  return <div className="text-muted-foreground">{description ?? ''}</div>;
}

function EditableExampleValues({ exampleValues }: { exampleValues: string[] }) {
  return (
    <div className="text-muted-foreground">{exampleValues.join(', ')}</div>
  );
}
