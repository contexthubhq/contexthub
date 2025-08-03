import { Checkbox } from '@/components/ui/checkbox';
import { Table } from 'lucide-react';
import { STYLES } from './constants';
import { cn } from '@/lib/utils';

interface TableItemProps {
  table: { fullyQualifiedTableName: string; tableName: string };
  selectedTables?: Set<string>;
  selectable: boolean;
  /** Currently highlighted table ID */
  highlightedTable?: string;
  /** Whether the tree supports highlighting */
  highlightable?: boolean;
  onSelectionChange?: ({
    tableId,
    checked,
  }: {
    tableId: string;
    checked: boolean;
  }) => void;
  onHighlightChange?: (tableId: string | null) => void;
}

export function TableItem({
  table,
  selectedTables = new Set<string>(),
  onSelectionChange,
  selectable,
  highlightedTable,
  onHighlightChange,
  highlightable,
}: TableItemProps) {
  const isHighlighted =
    highlightable && highlightedTable === table.fullyQualifiedTableName;

  const handleTableClick = () => {
    if (highlightable && onHighlightChange) {
      // If clicking the already highlighted table, deselect it
      if (isHighlighted) {
        onHighlightChange(null);
      } else {
        onHighlightChange(table.fullyQualifiedTableName);
      }
    }
  };

  return (
    <div
      className={cn(
        STYLES.hoverRow,
        isHighlighted && 'bg-accent',
        highlightable && 'cursor-pointer'
      )}
      onClick={highlightable ? handleTableClick : undefined}
    >
      {selectable && (
        <Checkbox
          checked={selectedTables.has(table.fullyQualifiedTableName)}
          onCheckedChange={(checked) =>
            onSelectionChange?.({
              tableId: table.fullyQualifiedTableName,
              checked: checked === true,
            })
          }
          onClick={(e) => e.stopPropagation()} // Prevent table click when clicking checkbox
        />
      )}
      <Table className={STYLES.icon} />
      <span className={STYLES.text}>{table.tableName}</span>
    </div>
  );
}
