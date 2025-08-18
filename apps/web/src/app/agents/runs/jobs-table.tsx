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

export function JobsTable() {
  const {
    data: agentJobs,
    isLoading,
    error,
  } = useAgentJobsQuery({
    refetchInterval: 1000,
  });
  const router = useRouter();
  if (isLoading) {
    return <LoadingTable rows={3} columns={6} />;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (agentJobs === undefined || agentJobs.length === 0) {
    return (
      <EmptySection title="No jobs" description="No queued or failed jobs." />
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Run At</TableHead>
          <TableHead>Attempts</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {agentJobs?.map((job) => (
          <TableRow
            key={job.id}
            onClick={() => router.push(`/agents/runs/${job.id}`)}
            role="button"
            className="cursor-pointer"
          >
            <TableCell>{job.id}</TableCell>
            <TableCell>{job.status}</TableCell>
            <TableCell>{job.runAt.toLocaleString()}</TableCell>
            <TableCell>
              {job.attempts} / {job.maxAttempts}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
