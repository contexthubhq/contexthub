'use client';

import { useAgentResultDetailsQuery } from '@/api/use-agent-result-details-query';
import { Button } from '@/components/ui/button';

export function ResultSection({ jobId }: { jobId: string }) {
  const {
    data: agentResult,
    isLoading,
    error,
  } = useAgentResultDetailsQuery(jobId);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  if (!agentResult) {
    return null;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-medium">Results</h2>
        <p className="text-muted-foreground text-sm">{agentResult.status}</p>
      </div>
      <div className="flex gap-2">
        <Button variant="destructive">Close</Button>
        <Button variant="default">Merge</Button>
      </div>
    </div>
  );
}
