import React from 'react';
import { DataTable } from '../../shared/DataTable';

export const DriverTable: React.FC<{ drivers: any[]; isLoading?: boolean }> = ({ drivers, isLoading }) => (
  <DataTable
    columns={[
      { key: 'name', header: 'Name' },
      { key: 'license_number', header: 'License' },
      { key: 'phone', header: 'Phone' },
      { key: 'status', header: 'Status' },
      { key: 'safety_score', header: 'Score' },
    ]}
    data={drivers}
    isLoading={isLoading}
    emptyTitle="No drivers"
  />
);