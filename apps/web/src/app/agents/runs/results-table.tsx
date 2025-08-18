'use client';

import { useAgentJobsQuery } from '@/api/use-agent-jobs-query';
import { EmptySection } from '@/components/empty-section';
import { LoadingTable } from '@/components/loading-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useRouter } from 'next/navigation';

export function ResultsTable() {
  const { data, isLoading, error } = useAgentJobsQuery({
    refetchInterval: 1000,
  });
  const { results } = data ?? {};
  const router = useRouter();

  if (isLoading) {
    return <LoadingTable rows={3} columns={3} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (results === undefined || results.length === 0) {
    return <EmptySection title="No results" description="No results found" />;
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Branch</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {results.map((result) => (
          <TableRow
            key={result.id}
            onClick={() => router.push(`/agents/runs/${result.jobId}`)}
            role="button"
            className="cursor-pointer"
          >
            <TableCell>{result.id}</TableCell>
            <TableCell>{result.status}</TableCell>
            <TableCell>{result.branchName}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
