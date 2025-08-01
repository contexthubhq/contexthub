import React from 'react';
import { getDataSources } from '@/actions/get-data-sources';
import { DataSourceManager } from '@/components/data-source/DataSourceManager';

export default async function Home() {
  const dataSources = await getDataSources();

  return <DataSourceManager dataSources={dataSources} />;
}
