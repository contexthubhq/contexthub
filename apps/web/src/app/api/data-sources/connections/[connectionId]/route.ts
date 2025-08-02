import { buildTableTree } from '@/lib/build-table-tree';
import { DataSourceConnectionDetails } from '@/types/data-source-connection-details';
import { TableDefinition } from '@contexthub/core';
import { registry } from '@contexthub/data-sources-all';
import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ connectionId: string }> }
): Promise<NextResponse<DataSourceConnectionDetails>> {
  const { connectionId } = await params;
  const dataSourceConnection = await getDataSourceConnection({
    id: connectionId,
  });
  const dataSource = registry.createInstance({
    type: dataSourceConnection.type,
    credentials: dataSourceConnection.credentials,
  });

  const tables: TableDefinition[] = await dataSource.getTablesList();
  const tableTree = buildTableTree({ tables });

  return NextResponse.json({
    id: dataSourceConnection.id,
    name: dataSourceConnection.name,
    type: dataSourceConnection.type,
    tables,
    tableTree,
  });
}
