import { DataSourceTableTree } from '@/types/table-tree';
import { TableDefinition } from '@contexthub/core';

export function buildTableTree(tables: TableDefinition[]): DataSourceTableTree {
  const tableTree: DataSourceTableTree = {
    catalogs: [],
  };

  for (const table of tables) {
    let catalog = tableTree.catalogs.find(
      (catalog) => catalog.name === table.tableCatalog
    );
    if (!catalog) {
      catalog = {
        name: table.tableCatalog,
        schemas: [],
      };
      tableTree.catalogs.push(catalog);
    }

    let schema = catalog.schemas.find(
      (schema) => schema.name === table.tableSchema
    );
    if (!schema) {
      schema = {
        name: table.tableSchema,
        tables: [],
      };
      catalog.schemas.push(schema);
    }

    schema.tables.push(table);
  }

  return tableTree;
}
