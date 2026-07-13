import React from 'react';
import { DataTable } from '../../shared/DataTable';
import { VehicleStatusBadge } from './VehicleStatusBadge';

export const VehicleTable: React.FC<{ vehicles: any[]; isLoading?: boolean }> = ({ vehicles, isLoading }) => (
  <DataTable
    columns={[
      { key: 'registration_number', header: 'Reg No' },
      { key: 'model', header: 'Model' },
      { key: 'type', header: 'Type' },
      { key: 'max_load_capacity', header: 'Capacity', render: (v) => `${v}kg` },
      { key: 'status', header: 'Status', render: (v) => <VehicleStatusBadge status={v} /> },
    ]}
    data={vehicles}
    isLoading={isLoading}
    emptyTitle="No vehicles"
  />
);