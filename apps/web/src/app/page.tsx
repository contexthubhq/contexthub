import React from 'react';
import { getDataSources } from './actions';
import { DataSourceManager } from './components/DataSourceManager';

export default async function Home() {
  const dataSources = await getDataSources();

  return <DataSourceManager dataSources={dataSources} />;
}
