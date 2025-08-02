'use client';

import * as React from 'react';
import {
  ChevronDown,
  ChevronRight,
  Database,
  ListTree,
  Table,
} from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { DataSourceTableTree } from '@/types/table-tree';

interface TableTreeProps {
  tableTree: DataSourceTableTree;
  selectedTables: Set<string>;
  onSelectionChange: (selectedTables: Set<string>) => void;
}

interface CheckboxState {
  checked: boolean | 'indeterminate';
}

export function TableTree({
  tableTree,
  selectedTables,
  onSelectionChange,
}: TableTreeProps) {
  const [expandedCatalogs, setExpandedCatalogs] = React.useState<Set<string>>(
    new Set()
  );
  const [expandedSchemas, setExpandedSchemas] = React.useState<Set<string>>(
    new Set()
  );

  // Helper function to get all table IDs from a catalog
  const getCatalogTableIds = (catalogName: string): string[] => {
    const catalog = tableTree.catalogs.find((c) => c.name === catalogName);
    if (!catalog) return [];

    return catalog.schemas.flatMap((schema) =>
      schema.tables.map((table) => table.fullyQualifiedTableName)
    );
  };

  // Helper function to get all table IDs from a schema
  const getSchemaTableIds = (
    catalogName: string,
    schemaName: string
  ): string[] => {
    const catalog = tableTree.catalogs.find((c) => c.name === catalogName);
    if (!catalog) return [];

    const schema = catalog.schemas.find((s) => s.name === schemaName);
    if (!schema) return [];

    return schema.tables.map((table) => table.fullyQualifiedTableName);
  };

  // Calculate checkbox state for catalog
  const getCatalogCheckboxState = (catalogName: string): CheckboxState => {
    const catalogTableIds = getCatalogTableIds(catalogName);
    const selectedCount = catalogTableIds.filter((id) =>
      selectedTables.has(id)
    ).length;

    if (selectedCount === catalogTableIds.length) {
      return { checked: true };
    }
    if (selectedCount > 0) {
      return { checked: 'indeterminate' };
    }
    return { checked: false };
  };

  // Calculate checkbox state for schema
  const getSchemaCheckboxState = (
    catalogName: string,
    schemaName: string
  ): CheckboxState => {
    const schemaTableIds = getSchemaTableIds(catalogName, schemaName);
    const selectedCount = schemaTableIds.filter((id) =>
      selectedTables.has(id)
    ).length;

    if (selectedCount === schemaTableIds.length) {
      return { checked: true };
    }
    if (selectedCount > 0) {
      return { checked: 'indeterminate' };
    }
    return { checked: false };
  };

  // Handle catalog checkbox change
  const handleCatalogSelectionChange = (
    catalogName: string,
    checked: boolean
  ) => {
    const catalogTableIds = getCatalogTableIds(catalogName);
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      catalogTableIds.forEach((id) => newSelectedTables.add(id));
    } else {
      catalogTableIds.forEach((id) => newSelectedTables.delete(id));
    }

    onSelectionChange(newSelectedTables);
  };

  // Handle schema checkbox change
  const handleSchemaSelectionChange = (
    catalogName: string,
    schemaName: string,
    checked: boolean
  ) => {
    const schemaTableIds = getSchemaTableIds(catalogName, schemaName);
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      schemaTableIds.forEach((id) => newSelectedTables.add(id));
    } else {
      schemaTableIds.forEach((id) => newSelectedTables.delete(id));
    }

    onSelectionChange(newSelectedTables);
  };

  // Handle table checkbox change
  const handleTableSelectionChange = (tableId: string, checked: boolean) => {
    const newSelectedTables = new Set(selectedTables);

    if (checked) {
      newSelectedTables.add(tableId);
    } else {
      newSelectedTables.delete(tableId);
    }

    onSelectionChange(newSelectedTables);
  };

  // Toggle catalog expansion
  const toggleCatalogExpansion = (catalogName: string) => {
    const newExpanded = new Set(expandedCatalogs);
    if (newExpanded.has(catalogName)) {
      newExpanded.delete(catalogName);
    } else {
      newExpanded.add(catalogName);
    }
    setExpandedCatalogs(newExpanded);
  };

  // Toggle schema expansion
  const toggleSchemaExpansion = (catalogName: string, schemaName: string) => {
    const schemaKey = `${catalogName}.${schemaName}`;
    const newExpanded = new Set(expandedSchemas);
    if (newExpanded.has(schemaKey)) {
      newExpanded.delete(schemaKey);
    } else {
      newExpanded.add(schemaKey);
    }
    setExpandedSchemas(newExpanded);
  };

  if (!tableTree.catalogs.length) {
    return (
      <div className="text-muted-foreground p-4 text-center">
        No tables found in this data source.
      </div>
    );
  }

  const textClassName = 'text-sm';
  const iconClassName = 'h-4 w-4';
  const chevronClassName = 'h-4 w-4 text-muted-foreground';

  return (
    <div className="gap-y-1">
      {tableTree.catalogs.map((catalog) => {
        const catalogState = getCatalogCheckboxState(catalog.name);
        const isExpanded = expandedCatalogs.has(catalog.name);

        return (
          <Collapsible
            key={catalog.name}
            open={isExpanded}
            onOpenChange={() => toggleCatalogExpansion(catalog.name)}
          >
            <div className="hover:bg-accent flex items-center space-x-2 rounded-md p-2">
              <Checkbox
                checked={catalogState.checked}
                onCheckedChange={(checked) =>
                  handleCatalogSelectionChange(catalog.name, checked === true)
                }
              />
              <CollapsibleTrigger className="flex flex-1 items-center space-x-2 text-left">
                {isExpanded ? (
                  <ChevronDown className={chevronClassName} />
                ) : (
                  <ChevronRight className={chevronClassName} />
                )}
                <Database className={iconClassName} />
                <span className={textClassName}>{catalog.name}</span>
              </CollapsibleTrigger>
            </div>

            <CollapsibleContent className="ml-6 space-y-1">
              {catalog.schemas.map((schema) => {
                const schemaState = getSchemaCheckboxState(
                  catalog.name,
                  schema.name
                );
                const schemaKey = `${catalog.name}.${schema.name}`;
                const isSchemaExpanded = expandedSchemas.has(schemaKey);

                return (
                  <Collapsible
                    key={schemaKey}
                    open={isSchemaExpanded}
                    onOpenChange={() =>
                      toggleSchemaExpansion(catalog.name, schema.name)
                    }
                  >
                    <div className="hover:bg-accent flex items-center space-x-3 rounded-md p-2">
                      <Checkbox
                        checked={schemaState.checked}
                        onCheckedChange={(checked) =>
                          handleSchemaSelectionChange(
                            catalog.name,
                            schema.name,
                            checked === true
                          )
                        }
                      />
                      <CollapsibleTrigger className="flex flex-1 items-center space-x-2 text-left">
                        {isSchemaExpanded ? (
                          <ChevronDown className={chevronClassName} />
                        ) : (
                          <ChevronRight className={chevronClassName} />
                        )}
                        <ListTree className={iconClassName} />
                        <span className={textClassName}>{schema.name}</span>
                      </CollapsibleTrigger>
                    </div>

                    <CollapsibleContent className="ml-6 space-y-1">
                      {schema.tables.map((table) => (
                        <div
                          key={table.fullyQualifiedTableName}
                          className="hover:bg-accent flex items-center space-x-2 rounded-md p-2"
                        >
                          <Checkbox
                            checked={selectedTables.has(
                              table.fullyQualifiedTableName
                            )}
                            onCheckedChange={(checked) =>
                              handleTableSelectionChange(
                                table.fullyQualifiedTableName,
                                checked === true
                              )
                            }
                          />
                          <Table className={iconClassName} />
                          <span className={textClassName}>
                            {table.tableName}
                          </span>
                        </div>
                      ))}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        );
      })}
    </div>
  );
}
