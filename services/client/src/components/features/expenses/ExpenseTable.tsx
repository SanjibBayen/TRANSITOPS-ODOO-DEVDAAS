import React, { useEffect, useState } from 'react';
import api from '../../../lib/axios';
import { DataTable } from '../../shared/DataTable';

interface ExpenseTableProps {
  refreshKey?: number;
}

export const ExpenseTable: React.FC<ExpenseTableProps> = ({ refreshKey }) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.get('/expenses').then(r => setExpenses(r.data.data || [])).finally(() => setIsLoading(false));
  }, [refreshKey]);

  return (
    <DataTable
      columns={[
        { key: 'type', header: 'Type' },
        { key: 'amount', header: 'Amount', render: (v) => `₹${v?.toLocaleString()}` },
        { key: 'description', header: 'Description' },
        { key: 'date', header: 'Date', render: (v) => v ? new Date(v).toLocaleDateString('en-IN') : '-' },
      ]}
      data={expenses}
      isLoading={isLoading}
      emptyTitle="No expenses"
    />
  );
};