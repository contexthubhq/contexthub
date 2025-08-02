import { Checkbox } from '@/components/ui/checkbox';
import { Table } from 'lucide-react';
import { STYLES } from './constants';

interface TableItemProps {
  table: { fullyQualifiedTableName: string; tableName: string };
  selectedTables: Set<string>;
  onSelectionChange: ({
    tableId,
    checked,
  }: {
    tableId: string;
    checked: boolean;
  }) => void;
}

export function TableItem({
  table,
  selectedTables,
  onSelectionChange,
}: TableItemProps) {
  return (
    <div className={STYLES.hoverRow}>
      <Checkbox
        checked={selectedTables.has(table.fullyQualifiedTableName)}
        onCheckedChange={(checked) =>
          onSelectionChange({
            tableId: table.fullyQualifiedTableName,
            checked: checked === true,
          })
        }
      />
      <Table className={STYLES.icon} />
      <span className={STYLES.text}>{table.tableName}</span>
    </div>
  );
}
