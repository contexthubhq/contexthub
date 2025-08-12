import { Table, TableBody, TableCell, TableRow } from './ui/table';
import { Skeleton } from './ui/skeleton';

export function LoadingTable({
  rows,
  columns,
}: {
  rows: number;
  columns: number;
}) {
  return (
    <Table>
      <TableBody>
        {[...Array(rows)].map((_, index) => (
          <TableRow key={index}>
            {[...Array(columns)].map((_, index) => (
              <TableCell key={index}>
                <Skeleton className="h-8 w-full" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
