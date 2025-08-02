'use client';

import * as React from 'react';
import { DataSourceTableTree } from '@/types/table-tree';
import { getCatalogTableIds, getSchemaTableIds } from './helpers';
import { CatalogItem } from './catalog-item';
import { useExpansion } from './use-expansion';

interface TableTreeProps {
  tableTree: DataSourceTableTree;
  selectedTables: Set<string>;
  onSelectionChange: (selectedTables: Set<string>) => void;
}

export function TableTree({
  tableTree,
  selectedTables,
  onSelectionChange,
}: TableTreeProps) {
  const {
    expandedCatalogs,
    expandedSchemas,
    toggleCatalogExpansion,
    toggleSchemaExpansion,
  } = useExpansion();

  const handleCatalogSelectionChange = ({
    catalogName,
    checked,
  }: {
    catalogName: string;
    checked: boolean;
  }) => {
    const catalogTableIds = getCatalogTableIds({
      tableTree,
      catalogName,
    });
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      catalogTableIds.forEach((id) => newSelectedTables.add(id));
    } else {
      catalogTableIds.forEach((id) => newSelectedTables.delete(id));
    }

    onSelectionChange(newSelectedTables);
  };

  const handleSchemaSelectionChange = ({
    catalogName,
    schemaName,
    checked,
  }: {
    catalogName: string;
    schemaName: string;
    checked: boolean;
  }) => {
    const schemaTableIds = getSchemaTableIds({
      tableTree,
      catalogName,
      schemaName,
    });
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      schemaTableIds.forEach((id) => newSelectedTables.add(id));
    } else {
      schemaTableIds.forEach((id) => newSelectedTables.delete(id));
    }

    onSelectionChange(newSelectedTables);
  };

  const handleTableSelectionChange = ({
    tableId,
    checked,
  }: {
    tableId: string;
    checked: boolean;
  }) => {
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      newSelectedTables.add(tableId);
    } else {
      newSelectedTables.delete(tableId);
    }

    onSelectionChange(newSelectedTables);
  };

  if (!tableTree.catalogs.length) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        No tables found in this data source.
      </div>
    );
  }

  return (
    <div className="gap-y-1">
      {tableTree.catalogs.map((catalog) => (
        <CatalogItem
          key={catalog.name}
          tableTree={tableTree}
          catalog={catalog}
          selectedTables={selectedTables}
          expandedCatalogs={expandedCatalogs}
          expandedSchemas={expandedSchemas}
          onCatalogSelectionChange={handleCatalogSelectionChange}
          onSchemaSelectionChange={handleSchemaSelectionChange}
          onTableSelectionChange={handleTableSelectionChange}
          onToggleCatalogExpansion={toggleCatalogExpansion}
          onToggleSchemaExpansion={toggleSchemaExpansion}
        />
      ))}
    </div>
  );
}
