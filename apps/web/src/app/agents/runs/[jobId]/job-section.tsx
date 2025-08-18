'use client';

import { useAgentJobDetailsQuery } from '@/api/use-agent-job-details-query';
import { ScrollArea } from '@/components/ui/scroll-area';

export function JobSection({ jobId }: { jobId: string }) {
  const { data: agentJob, isLoading, error } = useAgentJobDetailsQuery(jobId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Status</h2>
        <p className="text-muted-foreground text-sm">
          {agentJob?.status ?? 'completed'}
        </p>
      </div>
      {agentJob?.lastError && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-medium">Last error</h2>
          <ErrorStack error={agentJob.lastError} />
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
