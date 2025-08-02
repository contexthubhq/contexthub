import { DataSourceTableTree } from '@/types/table-tree';
import { CheckboxProps } from '@radix-ui/react-checkbox';

export function getCatalogTableIds({
  tableTree,
  catalogName,
}: {
  tableTree: DataSourceTableTree;
  catalogName: string;
}): string[] {
  const catalog = tableTree.catalogs.find((c) => c.name === catalogName);
  if (!catalog) return [];

  return catalog.schemas.flatMap((schema) =>
    schema.tables.map((table) => table.fullyQualifiedTableName)
  );
}

export function getSchemaTableIds({
  tableTree,
  catalogName,
  schemaName,
}: {
  tableTree: DataSourceTableTree;
  catalogName: string;
  schemaName: string;
}): string[] {
  const catalog = tableTree.catalogs.find((c) => c.name === catalogName);
  if (!catalog) return [];

  const schema = catalog.schemas.find((s) => s.name === schemaName);
  if (!schema) return [];

  return schema.tables.map((table) => table.fullyQualifiedTableName);
}

export function getCatalogCheckboxState({
  tableTree,
  catalogName,
  selectedTables,
}: {
  tableTree: DataSourceTableTree;
  catalogName: string;
  selectedTables: Set<string>;
}): CheckboxProps['checked'] {
  const catalogTableIds = getCatalogTableIds({ tableTree, catalogName });
  const selectedCount = catalogTableIds.filter((id) =>
    selectedTables.has(id)
  ).length;

  if (selectedCount === catalogTableIds.length) {
    return true;
  }
  if (selectedCount > 0) {
    return 'indeterminate';
  }
  return false;
}

export function getSchemaCheckboxState({
  tableTree,
  catalogName,
  schemaName,
  selectedTables,
}: {
  tableTree: DataSourceTableTree;
  catalogName: string;
  schemaName: string;
  selectedTables: Set<string>;
}): CheckboxProps['checked'] {
  const schemaTableIds = getSchemaTableIds({
    tableTree,
    catalogName,
    schemaName,
  });
  const selectedCount = schemaTableIds.filter((id) =>
    selectedTables.has(id)
  ).length;

  if (selectedCount === schemaTableIds.length) {
    return true;
  }
  if (selectedCount > 0) {
    return 'indeterminate';
  }
  return false;
}
