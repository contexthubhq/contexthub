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
import { getContextRepository } from '@/lib/get-context-repository';

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

  const repository = getContextRepository();
  const workingCopy = await repository.checkout({
    branchName: repository.mainBranchName,
  });
  const tableContext = await workingCopy.getTable({
    dataSourceConnectionId,
    fullyQualifiedTableName,
  });
  let table: TableMetadata;
  if (tableContext) {
    table = {
      ...tableDefinition,
      ...tableContext,
    };
  } else {
    table = {
      ...tableDefinition,
      dataSourceConnectionId,
      description: null,
    };
  }

  const columnContexts = (await workingCopy.listColumns()).filter(
    (column) =>
      column.dataSourceConnectionId === dataSourceConnectionId &&
      column.fullyQualifiedTableName === fullyQualifiedTableName
  );

  const columns: ColumnMetadata[] = [];
  for (const columnDefinition of columnDefinitions) {
    const columnContext = columnContexts.find(
      (column) =>
        column.dataSourceConnectionId === dataSourceConnectionId &&
        column.fullyQualifiedTableName === fullyQualifiedTableName &&
        column.columnName === columnDefinition.columnName
    );
    if (!columnContext) {
      columns.push({
        ...columnDefinition,
        dataSourceConnectionId,
        description: null,
        exampleValues: [],
      });
    } else {
      columns.push({
        ...columnDefinition,
        ...columnContext,
      });
    }
  }

  return NextResponse.json({
    table,
    columns,
  });
}

export const GET = withErrorHandling(getTableDetailsHandler);
