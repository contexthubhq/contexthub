import { DataSourceTableTree } from '@/types/table-tree';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, Database } from 'lucide-react';
import { STYLES } from './constants';
import { getCatalogCheckboxState } from './helpers';
import { SchemaItem } from './schema-item';

interface CatalogItemProps {
  tableTree: DataSourceTableTree;
  catalog: DataSourceTableTree['catalogs'][number];
  selectedTables: Set<string>;
  expandedCatalogs: Set<string>;
  expandedSchemas: Set<string>;
  onCatalogSelectionChange: (params: {
    catalogName: string;
    checked: boolean;
  }) => void;
  onSchemaSelectionChange: (params: {
    catalogName: string;
    schemaName: string;
    checked: boolean;
  }) => void;
  onTableSelectionChange: (params: {
    tableId: string;
    checked: boolean;
  }) => void;
  onToggleCatalogExpansion: (params: { catalogName: string }) => void;
  onToggleSchemaExpansion: (params: {
    catalogName: string;
    schemaName: string;
  }) => void;
}

export function CatalogItem({
  tableTree,
  catalog,
  selectedTables,
  expandedCatalogs,
  expandedSchemas,
  onCatalogSelectionChange,
  onSchemaSelectionChange,
  onTableSelectionChange,
  onToggleCatalogExpansion,
  onToggleSchemaExpansion,
}: CatalogItemProps) {
  const checkboxState = getCatalogCheckboxState({
    tableTree,
    catalogName: catalog.name,
    selectedTables,
  });
  const isExpanded = expandedCatalogs.has(catalog.name);

  return (
    <Collapsible
      key={catalog.name}
      open={isExpanded}
      onOpenChange={() =>
        onToggleCatalogExpansion({
          catalogName: catalog.name,
        })
      }
    >
      <div className={STYLES.hoverRow}>
        <Checkbox
          checked={checkboxState}
          onCheckedChange={(checked) =>
            onCatalogSelectionChange({
              catalogName: catalog.name,
              checked: checked === true,
            })
          }
        />
        <CollapsibleTrigger className="flex flex-1 items-center space-x-2 text-left">
          {isExpanded ? (
            <ChevronDown className={STYLES.chevron} />
          ) : (
            <ChevronRight className={STYLES.chevron} />
          )}
          <Database className={STYLES.icon} />
          <span className={STYLES.text}>{catalog.name}</span>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="ml-6 space-y-1">
        {catalog.schemas.map((schema) => (
          <SchemaItem
            key={`${catalog.name}.${schema.name}`}
            tableTree={tableTree}
            catalogName={catalog.name}
            schema={schema}
            selectedTables={selectedTables}
            expandedSchemas={expandedSchemas}
            onSelectionChange={onSchemaSelectionChange}
            onTableSelectionChange={onTableSelectionChange}
            onToggleExpansion={onToggleSchemaExpansion}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
