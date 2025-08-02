import { useTablesQuery } from '@/api/use-tables-query';
import { useUpdateSelectedTablesMutation } from '@/api/use-update-selected-tables-mutation';
import { TableTree } from '@/components/table-tree';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle, Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import type { SelectedTable } from '@/types/tables-query-result';

interface SelectTablesProps {
  connectionId: string;
}
export function SelectTables({ connectionId }: SelectTablesProps) {
  const {
    data: tablesQueryResult,
    isFetching: isTablesQueryFetching,
    isLoading: isTablesQueryLoading,
    error: tablesQueryError,
  } = useTablesQuery({
    dataSourceConnectionId: connectionId,
  });

  const {
    mutateAsync: updateSelectedTables,
    isPending: isUpdateSelectedTablesPending,
  } = useUpdateSelectedTablesMutation({
    dataSourceConnectionId: connectionId,
  });

  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());

  // Initialize selected tables from query result
  useEffect(() => {
    if (tablesQueryResult?.selectedTables) {
      setSelectedTables(
        new Set(
          tablesQueryResult.selectedTables.map(
            (table) => table.fullyQualifiedName
          )
        )
      );
    }
  }, [tablesQueryResult]);

  // Calculate if selection has changed
  const hasSelectionChanged = useMemo(() => {
    if (!tablesQueryResult?.selectedTables) return false;

    const originalTables = tablesQueryResult.selectedTables;
    if (selectedTables.size !== originalTables.length) return true;

    return !Array.from(selectedTables).every((table) =>
      originalTables.some(
        (selectedTable) => selectedTable.fullyQualifiedName === table
      )
    );
  }, [selectedTables, tablesQueryResult?.selectedTables]);

  // Handlers
  const handleSave = useCallback(async () => {
    const tablesToSave: SelectedTable[] = Array.from(selectedTables).map(
      (table) => ({
        fullyQualifiedName: table,
      })
    );
    await updateSelectedTables({ selectedTables: tablesToSave });
  }, [selectedTables, updateSelectedTables]);

  const handleReset = useCallback(() => {
    if (tablesQueryResult?.selectedTables) {
      setSelectedTables(
        new Set(
          tablesQueryResult.selectedTables.map(
            (table) => table.fullyQualifiedName
          )
        )
      );
    }
  }, [tablesQueryResult?.selectedTables]);

  const handleSelectionChange = useCallback((newSelection: Set<string>) => {
    setSelectedTables(newSelection);
  }, []);

  // Determine button disabled state
  const isButtonDisabled =
    !hasSelectionChanged ||
    isUpdateSelectedTablesPending ||
    !tablesQueryResult ||
    isTablesQueryFetching;

  // Loading state
  if (isTablesQueryLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-5 w-80" />
        </CardHeader>
        <Separator />
        <CardContent className="pt-4">
          <div className="h-96 w-full space-y-2">
            <Skeleton className="h-6 w-full" />
          </div>
        </CardContent>

        <Separator />
        <CardFooter className="flex justify-end gap-2 pt-6">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-9 w-16" />
          <Skeleton className="h-9 w-28" />
        </CardFooter>
      </Card>
    );
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
    <Card>
      <CardHeader>
        <CardTitle>Select tables</CardTitle>
        <CardDescription>
          Select the tables you want to use for your data source.
        </CardDescription>
      </CardHeader>
      <Separator />
      <CardContent className="pt-4">
        <ScrollArea className="h-96 w-full">
          {tablesQueryResult && (
            <TableTree
              tableTree={tablesQueryResult.tableTree}
              selectedTables={selectedTables}
              onSelectionChange={handleSelectionChange}
            />
          )}
        </ScrollArea>
      </CardContent>
      <Separator />
      <CardFooter className="flex justify-end gap-2 pt-6">
        <p className="text-muted-foreground text-sm">
          {selectedTables.size} selected
        </p>
        <Button
          variant="outline"
          onClick={handleReset}
          disabled={isButtonDisabled}
        >
          Reset
        </Button>
        <Button onClick={handleSave} disabled={isButtonDisabled}>
          {isUpdateSelectedTablesPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Save selection
        </Button>
      </CardFooter>
    </Card>
  );
}
