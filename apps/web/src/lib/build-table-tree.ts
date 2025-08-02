import { DataSourceTableTree } from '@/types/table-tree';
import { TableDefinition } from '@contexthub/core';

export function buildTableTree({
  tables,
}: {
  tables: TableDefinition[];
}): DataSourceTableTree {
  const catalogMap = new Map<string, Map<string, TableDefinition[]>>();

  for (const table of tables) {
    const { tableCatalog, tableSchema } = table;

    if (!catalogMap.has(tableCatalog)) {
      catalogMap.set(tableCatalog, new Map());
    }

    const schemaMap = catalogMap.get(tableCatalog)!;

    if (!schemaMap.has(tableSchema)) {
      schemaMap.set(tableSchema, []);
    }

    schemaMap.get(tableSchema)!.push(table);
  }

  // Sort catalogs and schemas for consistent output
  const sortedCatalogs = Array.from(catalogMap.entries()).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  return {
    catalogs: sortedCatalogs.map(([catalogName, schemaMap]) => ({
      name: catalogName,
      schemas: Array.from(schemaMap.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([schemaName, tables]) => ({
          name: schemaName,
          tables: tables.sort((a, b) => a.tableName.localeCompare(b.tableName)),
        })),
    })),
  };
}
