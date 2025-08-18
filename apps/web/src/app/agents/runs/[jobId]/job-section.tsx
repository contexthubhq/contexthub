'use client';

import { useAgentJobDetailsQuery } from '@/api/use-agent-job-details-query';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

export function JobSection({ jobId }: { jobId: string }) {
  const { data, isLoading, error } = useAgentJobDetailsQuery(jobId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!data) {
    return null;
  }

  const { job, result } = data;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Status</h2>
          <p className="text-muted-foreground text-sm">
            {job?.status ?? 'completed'}
          </p>
        </div>
        {job?.lastError && (
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Last error</h2>
            <ErrorStack error={job.lastError} />
          </div>
        )}
      </div>
      {result && (
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <h2 className="text-lg font-medium">Results</h2>
            <p className="text-muted-foreground text-sm">{result?.status}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="destructive">Close</Button>
            <Button variant="default">Merge</Button>
          </div>
        </div>
      )}
    </div>
  );
}
export function ErrorStack({ error }: { error: string }) {
  return (
    <ScrollArea className="h-64 w-full rounded-lg border p-4 text-xs">
      <pre className="whitespace-pre-wrap break-all">{error}</pre>
    </ScrollArea>
  );
}
