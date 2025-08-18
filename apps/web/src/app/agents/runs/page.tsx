import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { JobsTable } from './jobs-table';
import { RunAgentButton } from './run-agent-button';
import { getContextSourceConnections } from '../get-context-source-connections';
import { getDataSourceConnections } from '@/app/data-sources/get-data-source-connections';
import { ResultsTable } from './results-table';

export const dynamic = 'force-dynamic';

export default async function RunsPage() {
  const contextSourceConnections = await getContextSourceConnections();
  const dataSourceConnections = await getDataSourceConnections();
  return (
    <div className="space-y-4">
      <PageHeader title="Agent runs">
        <RunAgentButton
          contextSourceConnections={contextSourceConnections}
          dataSourceConnections={dataSourceConnections}
        />
      </PageHeader>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Runs</h2>
        <JobsTable />
      </div>
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold">Results</h2>
        <ResultsTable />
      </div>
    </div>
  );
}
