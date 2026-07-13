import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { DataTable } from '../../shared/DataTable';

export const FuelLogTable: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/fuel').then(r => setFuelLogs(r.data.data || [])).finally(() => setIsLoading(false));
  }, [refreshKey]);

  return (
    <DataTable
      columns={[
        { key: 'vehicle_id', header: 'Vehicle' },
        { key: 'liters', header: 'Liters' },
        { key: 'cost', header: 'Cost', render: (v) => `₹${v?.toLocaleString()}` },
        { key: 'price_per_liter', header: '₹/L', render: (v) => v ? `₹${v}` : '-' },
        { key: 'station', header: 'Station' },
        { key: 'date', header: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '-' },
      ]}
      data={fuelLogs}
      isLoading={isLoading}
      emptyTitle="No fuel logs"
    />
  );
};