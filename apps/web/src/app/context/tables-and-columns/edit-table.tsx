'use client';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Pencil } from 'lucide-react';
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
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';
import { useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

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
    return (
      <div className="flex flex-col gap-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
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
      </div>
      <div>
        <p className="text-muted-foreground text-xs">
          {tableDetailsQueryResult.table.description ?? 'Add a description...'}
        </p>
        <div className="flex flex-col gap-2 pt-6">
          <h4 className="text-sm font-semibold">
            Columns ({tableDetailsQueryResult.columns.length})
          </h4>
          <Columns columns={tableDetailsQueryResult.columns} />
        </div>
      </div>
    </div>
  );
}

function Columns({ columns }: { columns: ColumnMetadata[] }) {
  const orderedColumns = columns.sort(
    (a, b) => a.ordinalPosition - b.ordinalPosition
  );
  return (
    <ScrollArea className="h-[calc(100vh-20rem)] w-full">
      <Table className="text-xs" noWrapper>
        <TableHeader className="bg-background sticky top-0 z-10">
          <TableRow>
            <TableHead className="max-w-[50px]">Name</TableHead>
            <TableHead className="max-w-[50px]">Type</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Example values</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orderedColumns.map((column) => (
            <TableRow key={column.columnName}>
              <TableCell className="max-w-[70px] truncate whitespace-nowrap">
                {column.columnName}
              </TableCell>
              <TableCell className="max-w-[40px] truncate whitespace-nowrap">
                <Badge
                  variant="outline"
                  className="text-muted-foreground px-1.5 text-xs font-normal"
                >
                  {column.dataType.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                <EditableDescription description={column.description} />
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                <EditableExampleValues exampleValues={column.exampleValues} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function EditableDescription({ description }: { description: string | null }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string>(description ?? '');
  const [draft, setDraft] = useState<string>(value);

  const onSave = () => {
    setValue(draft);
    setOpen(false);
  };

  const onCancel = () => {
    setDraft(value);
    setOpen(false);
  };

  const hasValue = value.trim().length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="group block w-full cursor-pointer truncate whitespace-nowrap text-left focus:outline-none"
        >
          {hasValue ? (
            <span className="flex items-center gap-3">
              <span className="truncate">{value}</span>
              <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          ) : (
            <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Add description
            </span>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="flex flex-col gap-2">
          <Textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add description..."
            className="min-h-[120px]"
          />
          <div className="flex justify-end gap-2">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditableExampleValues({ exampleValues }: { exampleValues: string[] }) {
  const [open, setOpen] = useState(false);
  const [values, setValues] = useState<string[]>(exampleValues);
  const [draftValues, setDraftValues] = useState<string[]>(values);
  const [newValue, setNewValue] = useState<string>('');

  const addValue = () => {
    const trimmed = newValue.trim();
    if (!trimmed) return;
    if (!draftValues.includes(trimmed)) {
      setDraftValues([...draftValues, trimmed]);
    }
    setNewValue('');
  };

  const removeValue = (valueToRemove: string) => {
    setDraftValues(draftValues.filter((v) => v !== valueToRemove));
  };

  const onSave = () => {
    setValues(draftValues);
    setOpen(false);
  };

  const onCancel = () => {
    setDraftValues(values);
    setOpen(false);
  };

  const hasValue = values.length > 0;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <span
          role="button"
          tabIndex={0}
          className="group block w-full cursor-pointer truncate whitespace-nowrap text-left focus:outline-none"
        >
          {hasValue ? (
            <span className="flex items-center gap-3">
              <span className="truncate">{values.join(', ')}</span>
              <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
            </span>
          ) : (
            <span className="text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
              Add example values
            </span>
          )}
        </span>
      </PopoverTrigger>
      <PopoverContent className="w-96">
        <div className="flex flex-col gap-4">
          <div className="flex max-h-48 flex-col gap-2 overflow-auto">
            {draftValues.map((v) => (
              <div
                key={v}
                className="flex items-center justify-between gap-2 rounded border px-2 py-1 text-sm"
              >
                <span className="truncate">{v}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 p-0"
                  onClick={() => removeValue(v)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {draftValues.length === 0 && (
              <p className="text-muted-foreground text-sm italic">No values</p>
            )}
          </div>
          <div className="flex gap-2">
            <Input
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              placeholder="New value"
              className="flex-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addValue();
                }
              }}
            />
            <Button size="sm" onClick={addValue} disabled={!newValue.trim()}>
              Add
            </Button>
          </div>
          <div className="flex justify-end gap-2 border-t pt-2">
            <Button variant="secondary" size="sm" onClick={onCancel}>
              Cancel
            </Button>
            <Button size="sm" onClick={onSave}>
              Save
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
