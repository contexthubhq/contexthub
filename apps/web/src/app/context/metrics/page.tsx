import React from 'react';
import { PageHeader } from '@/components/layout/page-header';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MetricsTable } from './metrics-table';

export default async function ContextPage() {
  return (
    <div className="space-y-4">
      <PageHeader title="Metrics">
        <Button>
          <Plus />
          Add metric
        </Button>
      </PageHeader>
      <MetricsTable />
    </div>
  );
}
