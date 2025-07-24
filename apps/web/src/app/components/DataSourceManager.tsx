'use client';

import React, { useState } from 'react';
import { Database, Settings } from 'lucide-react';
import type { DataSourceInfo } from '../common/data-source-info';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { DataSourceCredentialsForm } from './DataSourceCredentialsForm';

export function DataSourceManager({
  dataSources,
}: {
  dataSources: DataSourceInfo[];
}) {
  const [selectedDataSource, setSelectedDataSource] =
    useState<DataSourceInfo | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleButtonClick = (dataSource: DataSourceInfo) => {
    setSelectedDataSource(dataSource);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDataSource(null);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Data Sources</h1>
        <p className="text-muted-foreground mt-2">
          Connect to your data sources to start generating context for your tables.
        </p>
      </div>

      {dataSources.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No data sources available</p>
            <p className="text-muted-foreground text-center max-w-sm">
              No data source connectors are currently registered. Please check your configuration.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {dataSources.map((dataSource) => (
            <Card 
              key={dataSource.type} 
              className="cursor-pointer transition-shadow hover:shadow-md"
              onClick={() => handleButtonClick(dataSource)}
            >
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  {dataSource.name}
                </CardTitle>
                {dataSource.description && (
                  <CardDescription>{dataSource.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {dataSource.fields.length} configuration {dataSource.fields.length === 1 ? 'field' : 'fields'}
                  </span>
                  <Button variant="ghost" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          {selectedDataSource && (
            <>
              <DialogHeader>
                <DialogTitle>Configure {selectedDataSource.name}</DialogTitle>
              </DialogHeader>
              <DataSourceCredentialsForm 
                dataSource={selectedDataSource} 
                onClose={handleCloseModal}
              />
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
