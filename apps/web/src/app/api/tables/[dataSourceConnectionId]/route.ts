import { buildTableTree } from '@/lib/build-table-tree';
import { TablesQueryResult } from '@/types/tables-query-result';
import { TableDefinition } from '@contexthub/core';
import { registry } from '@contexthub/data-sources-all';
import {
  getDataSourceConnection,
  getSelectedTables,
} from '@contexthub/data-sources-connections';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
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

  return NextResponse.json({
    tables,
    tableTree,
    selectedTables,
  });
}
