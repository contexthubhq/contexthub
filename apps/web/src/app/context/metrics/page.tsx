import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { MetricsTable } from './metrics-table';
import { AddMetricButton } from './add-metric-button';

export default async function ContextPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Metrics">
        <AddMetricButton />
      </PageHeader>
      <MetricsTable />
    </div>
  );
}
