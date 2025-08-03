import { TableDetailsQueryResult } from '@/types/table-details-query-result';
import { ColumnMetadata, TableMetadata } from '@contexthub/core';
import { registry } from '@contexthub/data-sources-all';
import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type GetResponse =
  | NextResponse<TableDetailsQueryResult>
  | NextResponse<{ error: string }>;

type GetParams = {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
};

export async function GET(
  _request: Request,
  {
    params,
  }: {
    params: Promise<GetParams>;
  }
): Promise<GetResponse> {
  const { dataSourceConnectionId, fullyQualifiedTableName } = await params;
  const dataSourceConnection = await getDataSourceConnection({
    id: dataSourceConnectionId,
  });
  const dataSource = registry.createInstance({
    type: dataSourceConnection.type,
    credentials: dataSourceConnection.credentials,
  });

  const tableDefinitions = await dataSource.getTablesList();
  const tableDefinition = tableDefinitions.find(
    (table) => table.fullyQualifiedTableName === fullyQualifiedTableName
  );
  if (!tableDefinition) {
    return NextResponse.json(
      {
        error: 'Table not found',
      },
      { status: 404 }
    );
  }

  const columnDefinitions = await dataSource.getColumnsList({
    fullyQualifiedTableName,
  });

  // TODO: Get context from context store.
  const table: TableMetadata = {
    ...tableDefinition,
    description: null,
  };

  const columns: ColumnMetadata[] = columnDefinitions.map(
    (columnDefinition) => ({
      ...columnDefinition,
      description: null,
      exampleValues: [],
    })
  );

  return NextResponse.json({
    table,
    columns,
  });
}
