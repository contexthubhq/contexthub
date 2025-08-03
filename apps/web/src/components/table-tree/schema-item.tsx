import { DataSourceTableTree } from '@/types/table-tree';
import { Collapsible } from '@/components/ui/collapsible';
import { CollapsibleTrigger } from '@/components/ui/collapsible';
import { CollapsibleContent } from '@/components/ui/collapsible';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronDown, ChevronRight, ListTree } from 'lucide-react';
import { STYLES } from './constants';
import { getSchemaCheckboxState } from './helpers';
import { TableItem } from './table-item';

interface SchemaItemProps {
  tableTree: DataSourceTableTree;
  catalogName: string;
  schema: DataSourceTableTree['catalogs'][number]['schemas'][number];
  selectedTables?: Set<string>;
  expandedSchemas: Set<string>;
  selectable: boolean;
  /** Currently highlighted table ID */
  highlightedTable?: string;
  /** Whether the tree supports highlighting */
  highlightable?: boolean;
  onSelectionChange?: (params: {
    catalogName: string;
    schemaName: string;
    checked: boolean;
  }) => void;
  onTableSelectionChange?: (params: {
    tableId: string;
    checked: boolean;
  }) => void;
  onHighlightChange?: (tableId: string | null) => void;
  onToggleExpansion: (params: {
    catalogName: string;
    schemaName: string;
  }) => void;
}

export function SchemaItem({
  tableTree,
  catalogName,
  schema,
  selectedTables = new Set<string>(),
  expandedSchemas,
  onSelectionChange,
  onTableSelectionChange,
  onToggleExpansion,
  selectable,
  highlightedTable,
  onHighlightChange,
  highlightable,
}: SchemaItemProps) {
  const schemaKey = `${catalogName}.${schema.name}`;
  const isSchemaExpanded = expandedSchemas.has(schemaKey);
  const checkboxState = getSchemaCheckboxState({
    tableTree,
    catalogName,
    schemaName: schema.name,
    selectedTables,
  });

  return (
    <Collapsible
      key={schemaKey}
      open={isSchemaExpanded}
      onOpenChange={() =>
        onToggleExpansion({
          catalogName,
          schemaName: schema.name,
        })
      }
    >
      <div className={STYLES.hoverRowSpaced}>
        {selectable && (
          <Checkbox
            checked={checkboxState}
            onCheckedChange={(checked) =>
              onSelectionChange?.({
                catalogName,
                schemaName: schema.name,
                checked: checked === true,
              })
            }
          />
        )}
        <CollapsibleTrigger className="flex flex-1 items-center space-x-2 text-left">
          {isSchemaExpanded ? (
            <ChevronDown className={STYLES.chevron} />
          ) : (
            <ChevronRight className={STYLES.chevron} />
          )}
          <ListTree className={STYLES.icon} />
          <span className={STYLES.text}>{schema.name}</span>
        </CollapsibleTrigger>
      </div>

      <CollapsibleContent className="ml-6 space-y-1">
        {schema.tables.map((table) => (
          <TableItem
            key={table.fullyQualifiedTableName}
            table={table}
            selectedTables={selectedTables}
            onSelectionChange={onTableSelectionChange}
            selectable={selectable}
            highlightedTable={highlightedTable}
            onHighlightChange={onHighlightChange}
            highlightable={highlightable}
          />
        ))}
      </CollapsibleContent>
    </Collapsible>
  );
}
