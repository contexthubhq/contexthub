'use client';

import React, { useState } from 'react';
import type { DataSourceInfo } from '../common/data-source-info';
import { Modal } from './Modal';
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
    <div>
      <h1>Data Sources</h1>

      {dataSources.length === 0 ? (
        <p>No data sources available.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {dataSources.map((dataSource) => (
            <button
              key={dataSource.type}
              onClick={() => handleButtonClick(dataSource)}
            >
              <div>{dataSource.name}</div>
              {dataSource.description && <div>{dataSource.description}</div>}
              <div>{dataSource.fields.length} fields</div>
            </button>
          ))}
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
        {selectedDataSource && (
          <DataSourceCredentialsForm dataSource={selectedDataSource} />
        )}
      </Modal>
    </div>
  );
}
