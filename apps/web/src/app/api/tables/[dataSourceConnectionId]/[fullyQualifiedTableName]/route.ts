import {
  ColumnMetadata,
  TableDetailsQueryResult,
  TableMetadata,
} from '@/types/table-details-query-result';
import { registry } from '@contexthub/data-sources-all';
import { getDataSourceConnection } from '@contexthub/data-sources-connections';
import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '@/lib/with-error-handling';
import { ApiError } from '@/lib/api-error';

export const dynamic = 'force-dynamic';

type GetParams = {
  dataSourceConnectionId: string;
  fullyQualifiedTableName: string;
};

async function getTableDetailsHandler(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<GetParams>;
  }
): Promise<NextResponse<TableDetailsQueryResult>> {
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
    throw ApiError.internal('Table not found');
  }

  const columnDefinitions = await dataSource.getColumnsList({
    fullyQualifiedTableName,
  });

  // TODO: Get context from context store.
  const table: TableMetadata = {
    ...tableDefinition,
    dataSourceConnectionId,
    kind: 'table',
    description: null,
  };

  const columns: ColumnMetadata[] = columnDefinitions.map(
    (columnDefinition) => ({
      ...columnDefinition,
      dataSourceConnectionId,
      kind: 'column',
      description: null,
      exampleValues: [],
    })
  );

  return NextResponse.json({
    table,
    columns,
  });
}

export const GET = withErrorHandling(getTableDetailsHandler);
