import React from 'react';
import { getDataSources } from '@/actions/get-data-sources';
import { DataSourceManager } from '@/components/data-source/data-source-manager';

export default async function Home() {
  const dataSources = await getDataSources();

  return <DataSourceManager dataSources={dataSources} />;
}
