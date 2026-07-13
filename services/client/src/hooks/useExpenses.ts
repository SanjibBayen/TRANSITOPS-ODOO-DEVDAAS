import { useState, useCallback } from 'react';
import api from '../lib/axios';
import { toast } from 'sonner';

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [fuelLogs, setFuelLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadExpenses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/expenses');
      setExpenses(response.data.data || []);
    } catch (err: any) {
      toast.error('Failed to load expenses');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadFuelLogs = useCallback(async () => {
    try {
      const response = await api.get('/fuel');
      setFuelLogs(response.data.data || []);
    } catch {
      // Silent fail
    }
  }, []);

  const createExpense = useCallback(async (data: any) => {
    try {
      const response = await api.post('/expenses', data);
      toast.success('Expense created');
      await loadExpenses();
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create expense');
      throw err;
    }
  }, [loadExpenses]);

  const createFuelLog = useCallback(async (data: any) => {
    try {
      const response = await api.post('/fuel', data);
      toast.success('Fuel log created');
      await loadFuelLogs();
      return response.data.data;
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to create fuel log');
      throw err;
    }
  }, [loadFuelLogs]);

  const loadAll = useCallback(async () => {
    await Promise.all([loadExpenses(), loadFuelLogs()]);
  }, [loadExpenses, loadFuelLogs]);

  return {
    expenses,
    fuelLogs,
    isLoading,
    loadExpenses,
    loadFuelLogs,
    createExpense,
    createFuelLog,
    loadAll,
  };
};