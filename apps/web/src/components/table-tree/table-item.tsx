import { Checkbox } from '@/components/ui/checkbox';
import { Table } from 'lucide-react';
import { STYLES } from './constants';

interface TableItemProps {
  table: { fullyQualifiedTableName: string; tableName: string };
  selectedTables?: Set<string>;
  selectable: boolean;
  onSelectionChange?: ({
    tableId,
    checked,
  }: {
    tableId: string;
    checked: boolean;
  }) => void;
}

export function TableItem({
  table,
  selectedTables = new Set<string>(),
  onSelectionChange,
  selectable,
}: TableItemProps) {
  return (
    <div className={STYLES.hoverRow}>
      {selectable && (
        <Checkbox
          checked={selectedTables.has(table.fullyQualifiedTableName)}
          onCheckedChange={(checked) =>
            onSelectionChange?.({
              tableId: table.fullyQualifiedTableName,
              checked: checked === true,
            })
          }
        />
      )}
      <Table className={STYLES.icon} />
      <span className={STYLES.text}>{table.tableName}</span>
    </div>
  );
}
