'use client';

import { useCreateAgentJobMutation } from '@/api/use-create-agent-job-mutation';
import { ContextSourceConnection } from '@contexthub/context-sources-connections';
import { useState } from 'react';
import {
  Sheet,
  SheetBody,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { DataSourceConnection } from '@contexthub/data-sources-connections';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';

export function RunAgentButton({
  contextSourceConnections,
  dataSourceConnections,
}: {
  contextSourceConnections: ContextSourceConnection[];
  dataSourceConnections: DataSourceConnection[];
}) {
  const { mutateAsync: createAgentJob, isPending: isCreatingAgentJob } =
    useCreateAgentJobMutation();
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = async () => {
    await createAgentJob();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button>
          <Play className="size-4" />
          Run agent
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Run context agent</SheetTitle>
        </SheetHeader>
        <SheetBody className="flex flex-col gap-6">
          <div className="pt-4">
            <h3 className="text-md font-semibold">
              The agent will generate context for the following data sources:
            </h3>
            <ul className="list-disc pl-4 [&>li]:mt-2">
              {dataSourceConnections.map((dataSourceConnection) => (
                <li key={dataSourceConnection.id}>
                  {dataSourceConnection.name}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-md font-semibold">
              The agent will use the following context sources:
            </h3>
            <ul className="list-disc pl-4 [&>li]:mt-2">
              {contextSourceConnections.map((contextSourceConnection) => (
                <li key={contextSourceConnection.id}>
                  {contextSourceConnection.name}
                </li>
              ))}
            </ul>
          </div>
        </SheetBody>
        <SheetFooter>
          <Button onClick={handleSubmit} disabled={isCreatingAgentJob}>
            {isCreatingAgentJob ? 'Creating job...' : 'Run agent'}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
