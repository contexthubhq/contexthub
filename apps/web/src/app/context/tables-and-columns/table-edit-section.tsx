'use client';

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Pencil, Loader2 } from 'lucide-react';
import { useTableDetailsQuery } from '@/api/use-table-details-query';
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
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { EditableList } from '@/components/ui/editable-list';
import { Column } from '@/types/table-details-query-result';
import { TableContext } from '@contexthub/core';
import { useUpsertTableContextMutation } from '@/api/use-upsert-table-context-mutation';
import { useUpsertColumnContextMutation } from '@/api/use-upsert-column-context-mutation';

/**
 * The section where the user can edit context for a selected table.
 */
export function TableEditSection({
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
        <AlertTitle>Error loading table details</AlertTitle>
        <AlertDescription>{tableDetailsQueryError.message}</AlertDescription>
      </Alert>
    );
  }

  if (!tableDetailsQueryResult) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h2 className="text-md font-semibold">
          {tableDetailsQueryResult.table.tableDefinition.tableName}
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        <EditableTableContext
          tableContext={tableDetailsQueryResult.table.tableContext}
        />
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

function EditableTableContext({
  tableContext,
}: {
  tableContext: TableContext;
}) {
  const {
    mutateAsync: upsertTableContext,
    isPending,
    error,
  } = useUpsertTableContextMutation();

  const [currentDescription, setCurrentDescription] = useState<string | null>(
    tableContext.description ?? null
  );

  const handleSaveDescription = async (description: string | null) => {
    const previous = currentDescription;
    // optimistic UI
    setCurrentDescription(description);
    try {
      await upsertTableContext({
        tableContext: {
          dataSourceConnectionId: tableContext.dataSourceConnectionId,
          fullyQualifiedTableName: tableContext.fullyQualifiedTableName,
          description: description ?? null,
        },
      });
    } catch {
      // revert on error
      setCurrentDescription(previous ?? null);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold">Table description</h4>
      <EditableTableDescription
        description={currentDescription}
        onSave={handleSaveDescription}
        isSaving={isPending}
        error={error}
      />
    </div>
  );
}

function Columns({ columns }: { columns: Column[] }) {
  const orderedColumns = columns.sort(
    (a, b) =>
      a.columnDefinition.ordinalPosition - b.columnDefinition.ordinalPosition
  );
  return (
    <ScrollArea className="h-[calc(100vh-25rem)] w-full">
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
            <TableRow key={column.columnDefinition.columnName}>
              <TableCell className="max-w-[70px] truncate whitespace-nowrap">
                {column.columnDefinition.columnName}
              </TableCell>
              <TableCell className="max-w-[40px] truncate whitespace-nowrap">
                <Badge
                  variant="outline"
                  className="text-muted-foreground px-1.5 text-xs font-normal"
                >
                  {column.columnDefinition.dataType.toLowerCase()}
                </Badge>
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                <EditableColumnDescription column={column} />
              </TableCell>
              <TableCell className="max-w-[100px] truncate">
                <EditableColumnExampleValues column={column} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}

function EditableColumnDescription({ column }: { column: Column }) {
  const [open, setOpen] = useState(false);
  const initialDescription = column.columnContext?.description ?? '';
  const [value, setValue] = useState<string>(initialDescription);
  const [draft, setDraft] = useState<string>(initialDescription);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    mutateAsync: upsertColumnContext,
    isPending,
    error,
  } = useUpsertColumnContextMutation();

  useEffect(() => {
    const next = column.columnContext?.description ?? '';
    setValue(next);
    if (!open) setDraft(next);
  }, [column.columnContext?.description]);

  const onSave = async () => {
    setLocalError(null);
    const previous = value;
    const next = draft;
    // optimistic UI
    setValue(next);
    setOpen(false);
    try {
      await upsertColumnContext({
        columnContext: {
          dataSourceConnectionId: column.columnContext.dataSourceConnectionId,
          fullyQualifiedTableName: column.columnContext.fullyQualifiedTableName,
          columnName: column.columnContext.columnName,
          description: next.trim().length > 0 ? next : null,
          exampleValues: column.columnContext.exampleValues ?? [],
        },
      });
    } catch (e) {
      // revert on error
      setValue(previous);
      setOpen(true);
      const message = e instanceof Error ? e.message : 'Failed to save';
      setLocalError(message);
    }
  };

  const onCancel = () => {
    setDraft(value);
    setLocalError(null);
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
            aria-busy={isPending}
            onKeyDown={(e) => {
              if (e.key === 'Escape') {
                onCancel();
              }
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                void onSave();
              }
            }}
          />
          {(localError || error) && (
            <div className="text-destructive text-xs">
              {localError || error?.message}
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={onSave} disabled={isPending}>
              {isPending ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditableColumnExampleValues({ column }: { column: Column }) {
  const [open, setOpen] = useState(false);
  const initialValues = column.columnContext?.exampleValues ?? [];
  const [values, setValues] = useState<string[]>(initialValues);
  const [draftValues, setDraftValues] = useState<string[]>(initialValues);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    mutateAsync: upsertColumnContext,
    isPending,
    error,
  } = useUpsertColumnContextMutation();

  useEffect(() => {
    const next = column.columnContext?.exampleValues ?? [];
    setValues(next);
    if (!open) setDraftValues(next);
  }, [column.columnContext?.exampleValues]);

  const onSave = async () => {
    setLocalError(null);
    const previous = values;
    const next = draftValues;
    // optimistic UI
    setValues(next);
    setOpen(false);
    try {
      await upsertColumnContext({
        columnContext: {
          dataSourceConnectionId: column.columnContext.dataSourceConnectionId,
          fullyQualifiedTableName: column.columnContext.fullyQualifiedTableName,
          columnName: column.columnContext.columnName,
          description: column.columnContext.description ?? null,
          exampleValues: next,
        },
      });
    } catch (e) {
      // revert on error
      setValues(previous);
      setOpen(true);
      const message = e instanceof Error ? e.message : 'Failed to save';
      setLocalError(message);
    }
  };

  const onCancel = () => {
    setDraftValues(values);
    setLocalError(null);
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
      <PopoverContent className="flex w-96 flex-col gap-4">
        <h3 className="text-sm font-semibold">Example values</h3>
        <EditableList
          values={draftValues}
          setValues={setDraftValues}
          placeholder="New example value"
        />
        {(localError || error) && (
          <div className="text-destructive text-xs">
            {localError || error?.message}
          </div>
        )}
        <div className="flex justify-end gap-2 border-t pt-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={onCancel}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={onSave} disabled={isPending}>
            {isPending ? (
              <span className="inline-flex items-center gap-1">
                <Loader2 className="h-3 w-3 animate-spin" />
                Saving
              </span>
            ) : (
              'Save'
            )}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function EditableTableDescription({
  description,
  onSave,
  isSaving = false,
  error = null,
}: {
  description: string | null;
  onSave: (description: string | null) => Promise<void> | void;
  isSaving?: boolean;
  error?: Error | null;
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<string>(description ?? '');
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(description ?? '');
  }, [description]);

  const handleSave = async () => {
    setLocalError(null);
    try {
      await onSave(draft.trim().length > 0 ? draft : null);
      setIsEditing(false);
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Failed to save';
      setLocalError(message);
    }
  };

  const onCancel = () => {
    setDraft(description ?? '');
    setLocalError(null);
    setIsEditing(false);
  };

  const hasValue = !!(description && description.trim().length > 0);

  if (isEditing) {
    return (
      <div className="flex flex-col gap-2">
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Add a description..."
          className="min-h-[80px] text-xs"
          autoFocus
          aria-busy={isSaving}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              onCancel();
            }
            if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              void handleSave();
            }
          }}
        />
        {(localError || error) && (
          <div className="text-destructive text-xs">
            {localError || error?.message}
          </div>
        )}
        <div className="flex items-center justify-between gap-2">
          <span className="text-muted-foreground text-[11px]">
            Press ⌘/Ctrl+Enter to save
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onCancel}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isSaving}>
              {isSaving ? (
                <span className="inline-flex items-center gap-1">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Saving
                </span>
              ) : (
                'Save'
              )}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <p
      className="group cursor-pointer text-xs transition-colors"
      onClick={() => setIsEditing(true)}
      role="button"
      tabIndex={0}
    >
      {hasValue ? (
        <span className="flex items-center gap-3">
          <span className="truncate">{description}</span>
          <Pencil className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
        </span>
      ) : (
        <span className="text-muted-foreground hover:text-foreground">
          Add a description
        </span>
      )}
    </p>
  );
}
