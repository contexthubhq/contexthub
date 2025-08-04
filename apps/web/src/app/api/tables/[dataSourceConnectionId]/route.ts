import { buildTableTree } from '@/lib/build-table-tree';
import { TablesQueryResult } from '@/types/tables-query-result';
import { TableDefinition } from '@contexthub/core';
import { registry } from '@contexthub/data-sources-all';
import {
  getDataSourceConnection,
  getSelectedTables,
} from '@contexthub/data-sources-connections';
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';

export const dynamic = 'force-dynamic';

async function getTablesHandler(
  _request: NextRequest,
  { params }: { params: Promise<{ dataSourceConnectionId: string }> }
): Promise<NextResponse<TablesQueryResult>> {
  const { dataSourceConnectionId } = await params;

  const dataSourceConnection = await getDataSourceConnection({
    id: dataSourceConnectionId,
  });

  const dataSource = registry.createInstance({
    type: dataSourceConnection.type,
    credentials: dataSourceConnection.credentials,
  });

  const selectedTables = await getSelectedTables({
    connectionId: dataSourceConnectionId,
  });

  const tables: TableDefinition[] = await dataSource.getTablesList();
  const tableTree = buildTableTree({ tables });

  const selectedTableDefinitions = tables.filter((table) =>
    selectedTables.some(
      (selectedTable) =>
        selectedTable.fullyQualifiedName === table.fullyQualifiedTableName
    )
  );
  const tableTreeSelectedOnly = buildTableTree({
    tables: selectedTableDefinitions,
  });

  return NextResponse.json({
    tables,
    tableTree,
    selectedTables,
    tableTreeSelectedOnly,
  });
}

export const GET = withErrorHandling(getTablesHandler);
