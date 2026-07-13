import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { DataTable } from '../../shared/DataTable';

export const MaintenanceTable: React.FC<{ refreshKey?: number }> = ({ refreshKey }) => {
  const [records, setRecords] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/maintenance').then(r => setRecords(r.data.data || [])).finally(() => setIsLoading(false));
  }, [refreshKey]);

  return (
    <DataTable
      columns={[
        { key: 'type', header: 'Type' },
        { key: 'cost', header: 'Cost', render: (v) => `₹${v?.toLocaleString()}` },
        { key: 'service_center', header: 'Service Center' },
        { key: 'status', header: 'Status' },
        { key: 'started_at', header: 'Started', render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '-' },
      ]}
      data={records}
      isLoading={isLoading}
      emptyTitle="No maintenance records"
    />
  );
};