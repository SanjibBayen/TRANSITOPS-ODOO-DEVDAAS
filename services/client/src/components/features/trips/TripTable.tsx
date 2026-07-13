import React from 'react';
import { DataTable } from '../../shared/DataTable';
import { TripStatusBadge } from './TripStatusBadge';

export const TripTable: React.FC<{ trips: any[]; isLoading?: boolean }> = ({ trips, isLoading }) => (
  <DataTable
    columns={[
      { key: 'trip_number', header: 'Trip ID' },
      { key: 'source', header: 'Route', render: (v, row) => `${v} → ${row.destination}` },
      { key: 'cargo_weight', header: 'Cargo', render: (v) => `${v}kg` },
      { key: 'status', header: 'Status', render: (v) => <TripStatusBadge status={v} /> },
      { key: 'created_at', header: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '-' },
    ]}
    data={trips}
    isLoading={isLoading}
    emptyTitle="No trips"
  />
);