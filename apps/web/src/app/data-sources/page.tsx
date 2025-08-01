import React from 'react';
import { getDataSources } from '@/actions/get-data-sources';
import { DataSourceManager } from '@/components/data-source/data-source-manager';
import { PageHeader } from '@/components/layout/page-header';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';

export default async function DataSourcesPage() {
  const dataSources = await getDataSources();

  return (
    <div className="space-y-4">
      <PageHeader title="Data sources">
        <Button>
          <PlusIcon className="h-4 w-4" />
          Add data source
        </Button>
      </PageHeader>
      <DataSourceManager dataSources={dataSources} />
    </div>
  );
}
